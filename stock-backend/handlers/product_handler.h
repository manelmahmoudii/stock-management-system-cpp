#pragma once
#include "../models/Product.h"
#include "../storage/sheet_storage.h"
#include <vector>
#include <string>
#include <sstream>
#include <map>
#include "transaction_handler.h"

const std::string PRODUCTS_FILE = "data/products.csv";
const std::string PRODUCTS_HEADER = "id,name,category,price,quantity,minThreshold";

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

public:
    static std::string getAll() {
        auto rows = SheetStorage::readAll(PRODUCTS_FILE);
        std::string json = "[";
        for (size_t i = 0; i < rows.size(); i++) {
            if (i > 0) json += ",";
            json += Product::fromRow(rows[i]).toJson();
        }
        json += "]";
        return json;
    }

    static std::string create(const std::string& body) {
        auto params = parseBody(body);
        auto rows = SheetStorage::readAll(PRODUCTS_FILE);

        int newId = 1;
        for (const auto& row : rows) {
            if (!row.empty()) {
                int existingId = std::stoi(row[0]);
                if (existingId >= newId) newId = existingId + 1;
            }
        }

        Product p(
            newId,
            params["name"],
            params["category"],
            std::stod(params["price"]),
            std::stoi(params["quantity"]),
            params.count("minThreshold") ? std::stoi(params["minThreshold"]) : 5
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
            !params.count("price") || !params.count("quantity") ||
            !params.count("minThreshold")) {
            return "{\"error\":\"Missing required fields for update\"}";
        }

        auto rows = SheetStorage::readAll(PRODUCTS_FILE);
        bool found = false;
        Product updatedProduct(
            id,
            params["name"],
            params["category"],
            std::stod(params["price"]),
            std::stoi(params["quantity"]),
            std::stoi(params["minThreshold"])
        );

        for (auto& row : rows) {
            if (!row.empty() && std::stoi(row[0]) == id) {
                row = updatedProduct.toRow();
                found = true;
                break;
            }
        }

        if (!found) return "{\"error\":\"Product not found\"}";

        SheetStorage::writeAll(PRODUCTS_FILE, PRODUCTS_HEADER, rows);
        return updatedProduct.toJson();
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

    static std::string sell(int id, const std::string& body) {
        auto params = parseBody(body);
        int qty = std::stoi(params["quantity"]);

        auto rows = SheetStorage::readAll(PRODUCTS_FILE);

        for (auto& row : rows) {
            if (!row.empty() && std::stoi(row[0]) == id) {
                Product p = Product::fromRow(row);
                int oldStock = p.quantity;

                if (p.quantity < qty) {
                    TransactionHandler::logTransaction("SALE", id, p.name, qty, oldStock, oldStock, 
                                                        p.price * qty, "FAILED");
                    return "{\"error\":\"Stock insuffisant\"}";
                }

                p.quantity -= qty;
                row = p.toRow();
                SheetStorage::writeAll(PRODUCTS_FILE, PRODUCTS_HEADER, rows);

                TransactionHandler::logTransaction("SALE", id, p.name, qty, oldStock, p.quantity,
                                                    p.price * qty, "COMPLETED");

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

    // product_handler.h - À l'intérieur de la classe ProductHandler

 // ─── DELIVER : livraison d'un produit (augmente la quantité) ─────────
    static std::string deliver(int id, const std::string& body) {
        printf("🔵 ===== DELIVER STARTED =====\n");
        printf("📦 Product ID: %d\n", id);
        printf("📦 Body: %s\n", body.c_str());
        
        auto params = parseBody(body);
        
        if (!params.count("quantity")) {
            printf("❌ Quantity parameter missing\n");
            return "{\"error\":\"Quantity parameter missing\"}";
        }
        
        int qty = std::stoi(params["quantity"]);
        printf("📊 Quantity to add: %d\n", qty);
        
        if (qty <= 0) {
            printf("❌ Quantity must be positive\n");
            return "{\"error\":\"Quantity must be positive\"}";
        }

        auto rows = SheetStorage::readAll(PRODUCTS_FILE);
        printf("📋 CSV rows loaded: %zu\n", rows.size());

        for (auto& row : rows) {
            if (!row.empty()) {
                int currentId = std::stoi(row[0]);
                if (currentId == id) {
                    printf("✅ Product found!\n");
                    Product p = Product::fromRow(row);
                    int oldStock = p.quantity;
                    printf("📊 Old stock: %d\n", oldStock);

                    p.quantity += qty;
                    printf("📊 New stock: %d\n", p.quantity);
                    
                    row = p.toRow();
                    SheetStorage::writeAll(PRODUCTS_FILE, PRODUCTS_HEADER, rows);
                    printf("💾 CSV file saved\n");

                    // Enregistrer la transaction de livraison
                    printf("📝 Logging delivery transaction...\n");
                    TransactionHandler::logTransaction("DELIVERY", id, p.name, qty, oldStock, p.quantity,
                                                        p.price * qty, "COMPLETED");
                    printf("✅ Transaction logged successfully\n");

                    std::string result = "{"
                        "\"product\":" + p.toJson() + ","
                        "\"message\":\"Stock updated successfully\","
                        "\"oldStock\":" + std::to_string(oldStock) + ","
                        "\"newStock\":" + std::to_string(p.quantity) +
                    "}";
                    printf("🎉 Result: %s\n", result.c_str());
                    return result;
                }
            }
        }
        
        printf("❌ Product not found with ID: %d\n", id);
        return "{\"error\":\"Product not found\"}";
    }
};