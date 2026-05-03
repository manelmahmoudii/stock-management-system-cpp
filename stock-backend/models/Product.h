#pragma once
#include <string>
#include <vector>

class Product {
public:
    int id;
    std::string name;
    std::string category;
    double price;
    int quantity;
    int minThreshold;
    std::string image;  // NOUVEAU : chemin de l'image

    Product() : id(0), price(0), quantity(0), minThreshold(5) {}

    Product(int id, const std::string& name, const std::string& category,
            double price, int quantity, int minThreshold = 5, const std::string& image = "")
        : id(id), name(name), category(category),
          price(price), quantity(quantity), minThreshold(minThreshold), image(image) {}

    std::vector<std::string> toRow() const {
        return {
            std::to_string(id),
            name,
            category,
            std::to_string(price),
            std::to_string(quantity),
            std::to_string(minThreshold),
            image  // NOUVEAU
        };
    }

    static Product fromRow(const std::vector<std::string>& row) {
        if (row.size() < 7) {
            return Product();
        }
        return Product(
            std::stoi(row[0]),
            row[1],
            row[2],
            std::stod(row[3]),
            std::stoi(row[4]),
            std::stoi(row[5]),
            row.size() > 6 ? row[6] : ""  // Image (optionnel)
        );
    }

    std::string toJson() const {
        return "{"
            "\"id\":" + std::to_string(id) + ","
            "\"name\":\"" + name + "\","
            "\"category\":\"" + category + "\","
            "\"price\":" + std::to_string(price) + ","
            "\"quantity\":" + std::to_string(quantity) + ","
            "\"minThreshold\":" + std::to_string(minThreshold) + ","
            "\"image\":\"" + image + "\""
        "}";
    }
};