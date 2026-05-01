#pragma once
#include "../models/Product.h"
#include "../storage/sheet_storage.h"
#include <vector>
#include <string>
#include <sstream>
#include <map>  // N'OUBLIEZ PAS D'AJOUTER CETTE INCLUSION !

const std::string PRODUCTS_FILE = "data/products.csv";
const std::string PRODUCTS_HEADER = "id,name,category,price,quantity,minThreshold";

class ProductHandler {
private:
    // DÉPLACER parseBody ICI (dans la partie private, AVANT son utilisation)
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
    // ─── READ : récupère tous les produits ───────────────────────────
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

    // ─── CREATE : ajoute un nouveau produit ─────────────────────────
    static std::string create(const std::string& body) {
        auto params = parseBody(body);
        auto rows = SheetStorage::readAll(PRODUCTS_FILE);

        // Génère un nouvel ID (max existant + 1)
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

    // ─── UPDATE : modifie un produit existant ────────────────────────
    static std::string update(int id, const std::string& body) {
        auto params = parseBody(body);
        auto rows = SheetStorage::readAll(PRODUCTS_FILE);

        for (auto& row : rows) {
            if (!row.empty() && std::stoi(row[0]) == id) {
                Product p = Product::fromRow(row);

                if (params.count("name"))         p.name = params["name"];
                if (params.count("category"))     p.category = params["category"];
                if (params.count("price"))        p.price = std::stod(params["price"]);
                if (params.count("quantity"))     p.quantity = std::stoi(params["quantity"]);
                if (params.count("minThreshold")) p.minThreshold = std::stoi(params["minThreshold"]);

                row = p.toRow();
                SheetStorage::writeAll(PRODUCTS_FILE, PRODUCTS_HEADER, rows);
                return p.toJson();
            }
        }
        return "{\"error\":\"Product not found\"}";
    }

    // ─── DELETE : supprime un produit ────────────────────────────────
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

    // ─── SELL : vente d'un produit ─────────────────────────────
    static std::string sell(int id, const std::string& body) {
        auto params = parseBody(body);
        int qty = std::stoi(params["quantity"]);

        auto rows = SheetStorage::readAll(PRODUCTS_FILE);

        for (auto& row : rows) {
            if (!row.empty() && std::stoi(row[0]) == id) {
                Product p = Product::fromRow(row);

                if (p.quantity < qty) {
                    return "{\"error\":\"Stock insuffisant\"}";
                }

                p.quantity -= qty;
                row = p.toRow();
                SheetStorage::writeAll(PRODUCTS_FILE, PRODUCTS_HEADER, rows);

                return "{"
                    "\"product\":" + p.toJson() + ","
                    "\"transaction\":{"
                        "\"type\":\"SALE\","
                        "\"productId\":" + std::to_string(id) + ","
                        "\"quantity\":" + std::to_string(qty) + ","
                        "\"productName\":\"" + p.name + "\""
                    "}"
                "}";
            }
        }
        return "{\"error\":\"Product not found\"}";
    }
};