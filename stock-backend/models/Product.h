#pragma once
#include <string>
#include <vector>  // AJOUTÉ - nécessaire pour std::vector

class Product {
public:
    int id;
    std::string name;
    std::string category;
    double price;
    int quantity;
    int minThreshold;

    // Constructeurs
    Product() : id(0), price(0), quantity(0), minThreshold(5) {}

    Product(int id, const std::string& name, const std::string& category,
            double price, int quantity, int minThreshold = 5)
        : id(id), name(name), category(category),
          price(price), quantity(quantity), minThreshold(minThreshold) {}

    // Convertit le produit en ligne CSV
    std::vector<std::string> toRow() const {
        return {
            std::to_string(id),
            name,
            category,
            std::to_string(price),
            std::to_string(quantity),
            std::to_string(minThreshold)
        };
    }

    // Crée un produit depuis une ligne CSV
    static Product fromRow(const std::vector<std::string>& row) {
        if (row.size() < 6) {
            return Product();  // Retourne un produit vide si ligne invalide
        }
        return Product(
            std::stoi(row[0]),
            row[1],
            row[2],
            std::stod(row[3]),
            std::stoi(row[4]),
            std::stoi(row[5])
        );
    }

    // Convertit en JSON string pour l'API
    std::string toJson() const {
        return "{"
            "\"id\":" + std::to_string(id) + ","
            "\"name\":\"" + name + "\","
            "\"category\":\"" + category + "\","
            "\"price\":" + std::to_string(price) + ","
            "\"quantity\":" + std::to_string(quantity) + ","
            "\"minThreshold\":" + std::to_string(minThreshold) +
        "}";
    }
};