#ifndef USER_HANDLER_H
#define USER_HANDLER_H

#include "../models/User.h"
#include "../storage/sheet_storage.h"
#include "../utils/hash.h"
#include "../utils/jwt.h"
#include "../httplib.h"        // ← changer de "httplib.h" à "../httplib.h"
#include <map>
#include <sstream>
#include <algorithm>
#include <iostream>
#include <ctime>

const std::string USERS_FILE = "data/users.csv";
const std::string USERS_HEADER = "id,firstName,lastName,email,password,role";
const std::string JWT_SECRET = "mon-super-secret-jwt-2024";

class UserHandler {
private:
    static std::map<std::string, std::string> parseBody(const std::string& body) {
        std::map<std::string, std::string> params;
        std::stringstream ss(body);
        std::string pair;
        while (std::getline(ss, pair, '&')) {
            size_t pos = pair.find('=');
            if (pos != std::string::npos) {
                params[pair.substr(0, pos)] = pair.substr(pos + 1);
            }
        }
        return params;
    }

    static std::vector<Row> getAllRows() {
        return SheetStorage::readAll(USERS_FILE);
    }

    static void writeAllRows(const std::vector<Row>& rows) {
        SheetStorage::writeAll(USERS_FILE, USERS_HEADER, rows);
    }

    static bool isAdmin(const httplib::Request& req) {
        std::string authHeader = req.get_header_value("Authorization");
        if (authHeader.empty() || authHeader.find("Bearer ") != 0) return false;
        std::string token = authHeader.substr(7);
        auto payload = jwt::verify(token, JWT_SECRET);
        return !payload.empty();
    }

    static std::string urlDecode(const std::string& str) {
    std::string result;
    for (size_t i = 0; i < str.size(); ++i) {
        if (str[i] == '%' && i + 2 < str.size()) {
            int value;
            std::stringstream ss;
            ss << std::hex << str.substr(i + 1, 2);
            ss >> value;
            result += static_cast<char>(value);
            i += 2;
        } else if (str[i] == '+') {
            result += ' ';
        } else {
            result += str[i];
        }
    }
    return result;
}

public:
static std::pair<std::string, int> registerUser(const std::string& body) {
    auto params = parseBody(body);
    if (!params.count("firstName") || !params.count("lastName") ||
        !params.count("email") || !params.count("password"))
        return {"{\"error\":\"Missing fields\"}", 400};

    std::string firstName = params["firstName"];
    std::string lastName = params["lastName"];
    std::string email = params["email"];
    std::string password = params["password"];
    
    // ✅ Décoder l'email (convertir %40 en @, etc.)
    email = urlDecode(email);
    
    std::cout << "Register - Email decoded: " << email << std::endl;

    auto rows = getAllRows();
    for (const auto& row : rows)
        if (row.size() >= 4 && row[3] == email)
            return {"{\"error\":\"Email exists\"}", 409};

    int newId = rows.size() + 1;
    std::string pwdHash = sha256(password);
    User newUser(newId, firstName, lastName, email, pwdHash, "client");
    rows.push_back(newUser.toRow());
    writeAllRows(rows);
    return {"{\"success\":true,\"message\":\"User registered\"}", 201};
}


static std::pair<std::string, int> login(const std::string& body) {
    auto params = parseBody(body);
    if (!params.count("email") || !params.count("password"))
        return {"{\"error\":\"Email and password required\"}", 400};

    std::string email = params["email"];
    std::string password = params["password"];
    
    // Décoder l'email (convertir %40 en @)
    email = urlDecode(email);
    
    std::cout << "=== LOGIN ATTEMPT ===" << std::endl;
    std::cout << "Email decoded: " << email << std::endl;
    std::cout << "Password: " << password << std::endl;
    
    auto rows = getAllRows();
    std::string pwdHash = sha256(password);
    
    std::cout << "Computed hash: " << pwdHash << std::endl;
    
    for (const auto& row : rows) {
        if (row.size() >= 5 && row[3] == email) {
            std::cout << "Found user, stored hash: " << row[4] << std::endl;
            if (row[4] == pwdHash) {
                std::string role = (row.size() >= 6) ? row[5] : "client";
                std::map<std::string, std::string> claims;
                claims["id"] = row[0];
                claims["email"] = email;
                claims["role"] = role;
                std::string token = jwt::generate(claims, JWT_SECRET, 86400);
                return {"{\"success\":true,\"token\":\"" + token + "\",\"role\":\"" + role + "\"}", 200};
            }
        }
    }
    return {"{\"error\":\"Invalid credentials\"}", 401};
}


static std::pair<std::string, int> getAllUsers(const httplib::Request& req) {
    std::string authHeader = req.get_header_value("Authorization");
    
    if (authHeader.empty() || authHeader.find("Bearer ") != 0) {
        return {"{\"error\":\"Unauthorized\"}", 401};
    }
    
    std::string token = authHeader.substr(7);
    auto payload = jwt::verify(token, JWT_SECRET);
    
    if (payload.empty() || payload["role"] != "admin") {
        return {"{\"error\":\"Forbidden\"}", 403};
    }
    
    auto rows = getAllRows();
    std::string json = "[";
    bool first = true;
    
    for (const auto& row : rows) {
        if (row.size() < 5) continue;
        
        // ✅ SKIP l'admin (email = admin@example.com)
        if (row[3] == "admin@example.com") {
            std::cout << "Skipping admin user from list" << std::endl;
            continue;
        }
        
        if (!first) json += ",";
        first = false;
        
        json += "{";
        json += "\"id\":" + row[0] + ",";
        json += "\"firstName\":\"" + row[1] + "\",";
        json += "\"lastName\":\"" + row[2] + "\",";
        json += "\"email\":\"" + row[3] + "\"";
        json += "}";
    }
    json += "]";
    
    std::cout << "Returning " << (rows.size() - 1) << " users (admin excluded)" << std::endl;
    return {json, 200};
}



    static std::pair<std::string, int> deleteUser(int id, const httplib::Request& req) {
        std::string authHeader = req.get_header_value("Authorization");
        if (authHeader.empty() || authHeader.find("Bearer ") != 0)
            return {"{\"error\":\"Unauthorized\"}", 401};
        
        std::string token = authHeader.substr(7);
        auto payload = jwt::verify(token, JWT_SECRET);
        if (payload.empty()) return {"{\"error\":\"Invalid token\"}", 401};

        auto rows = getAllRows();
        std::vector<Row> newRows;
        bool found = false;
        for (const auto& row : rows) {
            if (!row.empty()) {
                try {
                    if (std::stoi(row[0]) == id) { found = true; continue; }
                } catch (...) {}
            }
            newRows.push_back(row);
        }
        if (!found) return {"{\"error\":\"User not found\"}", 404};
        writeAllRows(newRows);
        return {"{\"success\":true}", 200};
    }

    static std::pair<std::string, int> setupDefaultAdmin() {
        auto rows = getAllRows();
        for (const auto& row : rows) {
            if (row.size() >= 4 && row[3] == "admin@example.com") {
                return {"{\"message\":\"Admin already exists\"}", 200};
            }
        }
        int newId = rows.size() + 1;
        std::string adminHash = sha256("admin123");
        User adminUser(newId, "Admin", "System", "admin@example.com", adminHash, "admin");
        rows.push_back(adminUser.toRow());
        writeAllRows(rows);
        return {"{\"message\":\"Admin created: admin@example.com / admin123\",\"success\":true}", 201};
    }
};

#endif