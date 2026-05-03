#pragma once
#include "../models/Product.h"
#include "../storage/sheet_storage.h"
#include <vector>
#include <string>
#include <sstream>
#include <map>
#include "transaction_handler.h"
#include "../utils/jwt.h"
#include "../utils/hash.h"  
#include "../config/constants.h"

const std::string PRODUCTS_FILE = "data/products.csv";
const std::string PRODUCTS_HEADER = "id,name,category,price,quantity,minThreshold,image";

class ProductHandler {
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

    // Fonction pour décoder les URLs (%2F -> /, etc.)
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
    static std::string getAll() {
        auto rows = SheetStorage::readAll(PRODUCTS_FILE);
        std::string json = "[";
        bool first = true;
        
        for (const auto& row : rows) {
            if (row.empty() || row.size() < 7) continue;
            if (row[0] == "id") continue;
            
            try {
                int id = std::stoi(row[0]);
                if (id == 0) continue;
                
                Product p = Product::fromRow(row);
                if (p.id == 0 || p.name.empty()) continue;
                
                if (!first) json += ",";
                first = false;
                json += p.toJson();
            } catch (...) {
                continue;
            }
        }
        json += "]";
        return json;
    }

    static std::string create(const std::string& body) {
        auto params = parseBody(body);
        
        if (!params.count("name") || !params.count("category") ||
            !params.count("price") || !params.count("quantity")) {
            return "{\"error\":\"Missing required fields\"}";
        }
        
        auto rows = SheetStorage::readAll(PRODUCTS_FILE);

        int newId = 1;
        for (const auto& row : rows) {
            if (!row.empty() && row.size() >= 1) {
                try {
                    int existingId = std::stoi(row[0]);
                    if (existingId >= newId) newId = existingId + 1;
                } catch (...) {}
            }
        }

        // Décoder l'image si elle existe
        std::string imagePath = "";
        if (params.count("image")) {
            imagePath = urlDecode(params["image"]);
        }

        Product p(
            newId,
            params["name"],
            params["category"],
            std::stod(params["price"]),
            std::stoi(params["quantity"]),
            params.count("minThreshold") ? std::stoi(params["minThreshold"]) : 5,
            imagePath
        );

        rows.push_back(p.toRow());
        SheetStorage::writeAll(PRODUCTS_FILE, PRODUCTS_HEADER, rows);

        return p.toJson();
    }

    static std::pair<std::string, int> getOne(int id) {
        auto rows = SheetStorage::readAll(PRODUCTS_FILE);
        for (const auto& row : rows) {
            if (!row.empty() && std::stoi(row[0]) == id) {
                return {Product::fromRow(row).toJson(), 200};
            }
        }
        return {"{\"error\":\"Product not found\"}", 404};
    }

    static std::string update(int id, const std::string& body) {
        auto params = parseBody(body);
        
        if (!params.count("name") || !params.count("category") ||
            !params.count("price") || !params.count("quantity")) {
            return "{\"error\":\"Missing required fields for update\"}";
        }

        auto rows = SheetStorage::readAll(PRODUCTS_FILE);
        bool found = false;
        
        for (auto& row : rows) {
            if (!row.empty() && row.size() >= 1) {
                try {
                    if (std::stoi(row[0]) == id) {
                        // Décoder l'image si elle existe
                        std::string imagePath = "";
                        if (params.count("image")) {
                            imagePath = urlDecode(params["image"]);
                        } else if (row.size() > 6) {
                            imagePath = row[6];
                        }
                        
                        Product updatedProduct(
                            id,
                            params["name"],
                            params["category"],
                            std::stod(params["price"]),
                            std::stoi(params["quantity"]),
                            params.count("minThreshold") ? std::stoi(params["minThreshold"]) : 5,
                            imagePath
                        );
                        row = updatedProduct.toRow();
                        found = true;
                        break;
                    }
                } catch (...) {}
            }
        }

        if (!found) return "{\"error\":\"Product not found\"}";

        SheetStorage::writeAll(PRODUCTS_FILE, PRODUCTS_HEADER, rows);
        return "{\"success\":true}";
    }

    static std::string remove(int id) {
        auto rows = SheetStorage::readAll(PRODUCTS_FILE);
        std::vector<Row> newRows;

        bool found = false;
        for (const auto& row : rows) {
            if (!row.empty() && std::stoi(row[0]) == id) {
                found = true;
                continue;
            }
            newRows.push_back(row);
        }

        if (!found) return "{\"error\":\"Product not found\"}";

        SheetStorage::writeAll(PRODUCTS_FILE, PRODUCTS_HEADER, newRows);
        return "{\"success\":true}";
    }

    static std::pair<int, std::string> getUserFromRequest(const httplib::Request& req) {
        std::string authHeader = req.get_header_value("Authorization");
        if (authHeader.empty() || authHeader.find("Bearer ") != 0) {
            return {0, ""};
        }
        std::string token = authHeader.substr(7);
        auto payload = jwt::verify(token, JWT_SECRET);
        
        int userId = payload.count("id") ? std::stoi(payload["id"]) : 0;
        std::string userEmail = payload.count("email") ? payload["email"] : "";
        
        return {userId, userEmail};
    }

    static std::string sell(int id, const std::string& body, const httplib::Request& req) {
        auto params = parseBody(body);
        int qty = std::stoi(params["quantity"]);
        auto [userId, userEmail] = getUserFromRequest(req);
        auto rows = SheetStorage::readAll(PRODUCTS_FILE);

        for (auto& row : rows) {
            if (!row.empty() && std::stoi(row[0]) == id) {
                Product p = Product::fromRow(row);
                int oldStock = p.quantity;

                if (p.quantity < qty) {
                    TransactionHandler::logTransaction("SALE", id, p.name, qty, oldStock, oldStock, 
                                                        p.price * qty, "FAILED", userId, userEmail);
                    return "{\"error\":\"Stock insuffisant\"}";
                }

                p.quantity -= qty;
                row = p.toRow();
                SheetStorage::writeAll(PRODUCTS_FILE, PRODUCTS_HEADER, rows);

                TransactionHandler::logTransaction("SALE", id, p.name, qty, oldStock, p.quantity,
                                                    p.price * qty, "COMPLETED", userId, userEmail);

                return "{"
                    "\"product\":" + p.toJson() + ","
                    "\"transaction\":{"
                        "\"type\":\"SALE\","
                        "\"productId\":" + std::to_string(id) + ","
                        "\"quantity\":" + std::to_string(qty) + ","
                        "\"productName\":\"" + p.name + "\","
                        "\"amount\":" + std::to_string(p.price * qty) +
                    "}"
                "}";
            }
        }
        return "{\"error\":\"Product not found\"}";
    }

    static std::string deliver(int id, const std::string& body, const httplib::Request& req) {
        printf(" ===== DELIVER STARTED =====\n");
        printf(" Product ID: %d\n", id);
        printf("Body: %s\n", body.c_str());
        
        auto params = parseBody(body);
        
        if (!params.count("quantity")) {
            printf(" Quantity parameter missing\n");
            return "{\"error\":\"Quantity parameter missing\"}";
        }
        
        int qty = std::stoi(params["quantity"]);
        printf(" Quantity to add: %d\n", qty);
        
        if (qty <= 0) {
            printf(" Quantity must be positive\n");
            return "{\"error\":\"Quantity must be positive\"}";
        }

        auto [userId, userEmail] = getUserFromRequest(req);
        
        if (userId == 0 || userEmail.empty()) {
            userId = 1;
            userEmail = "admin@example.com";
        }

        auto rows = SheetStorage::readAll(PRODUCTS_FILE);
        printf(" CSV rows loaded: %zu\n", rows.size());

        for (auto& row : rows) {
            if (!row.empty()) {
                int currentId = std::stoi(row[0]);
                if (currentId == id) {
                    printf("Product found!\n");
                    Product p = Product::fromRow(row);
                    int oldStock = p.quantity;
                    printf("Old stock: %d\n", oldStock);

                    p.quantity += qty;
                    printf("New stock: %d\n", p.quantity);
                    
                    row = p.toRow();
                    SheetStorage::writeAll(PRODUCTS_FILE, PRODUCTS_HEADER, rows);
                    printf("CSV file saved\n");

                    TransactionHandler::logTransaction("DELIVERY", id, p.name, qty, oldStock, p.quantity,
                                                        p.price * qty, "COMPLETED", userId, userEmail);
                    printf("Transaction logged successfully\n");

                    std::string result = "{"
                        "\"product\":" + p.toJson() + ","
                        "\"message\":\"Stock updated successfully\","
                        "\"oldStock\":" + std::to_string(oldStock) + ","
                        "\"newStock\":" + std::to_string(p.quantity) +
                    "}";
                    printf("Result: %s\n", result.c_str());
                    return result;
                }
            }
        }
        
        printf("Product not found with ID: %d\n", id);
        return "{\"error\":\"Product not found\"}";
    }
};