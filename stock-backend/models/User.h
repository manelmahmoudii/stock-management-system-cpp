#ifndef USER_H
#define USER_H

#include <string>
#include <vector>

class User {
public:
    int id;
    std::string firstName;
    std::string lastName;
    std::string email;
    std::string password;
    std::string role;

    User() : id(0), role("client") {}
    User(int id, const std::string& firstName, const std::string& lastName,
         const std::string& email, const std::string& password, const std::string& role = "client")
        : id(id), firstName(firstName), lastName(lastName),
          email(email), password(password), role(role) {}

    std::vector<std::string> toRow() const {
        return { std::to_string(id), firstName, lastName, email, password, role };
    }

    static User fromRow(const std::vector<std::string>& row) {
        if (row.size() < 5) return User();
        std::string role = (row.size() >= 6) ? row[5] : "client";
        return User(std::stoi(row[0]), row[1], row[2], row[3], row[4], role);
    }

    std::string toJson() const {
        return "{"
            "\"id\":" + std::to_string(id) + ","
            "\"firstName\":\"" + escapeJson(firstName) + "\","
            "\"lastName\":\"" + escapeJson(lastName) + "\","
            "\"email\":\"" + escapeJson(email) + "\""
        "}";
    }

private:
    static std::string escapeJson(const std::string& s) {
        std::string out;
        for (char c : s) {
            if (c == '"')  out += "\\\"";
            else if (c == '\\') out += "\\\\";
            else out += c;
        }
        return out;
    }
};

#endif