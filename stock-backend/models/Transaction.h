#pragma once
#include <string>
#include <vector>

class Transaction {
public:
    int id;
    std::string type;        // "SALE" ou "DELIVERY"
    int productId;
    std::string productName;
    int quantity;
    int oldStock;
    int newStock;
    double amount;
    std::string date;
    std::string status;      // "COMPLETED", "FAILED"

    Transaction() : id(0), productId(0), quantity(0), oldStock(0), newStock(0), amount(0) {}

    Transaction(int id, const std::string& type, int productId, const std::string& productName,
                int quantity, int oldStock, int newStock, double amount, const std::string& date, const std::string& status)
        : id(id), type(type), productId(productId), productName(productName),
          quantity(quantity), oldStock(oldStock), newStock(newStock), amount(amount), date(date), status(status) {}

    std::vector<std::string> toRow() const {
        return {
            std::to_string(id),
            type,
            std::to_string(productId),
            productName,
            std::to_string(quantity),
            std::to_string(oldStock),
            std::to_string(newStock),
            std::to_string(amount),
            date,
            status
        };
    }

    static Transaction fromRow(const std::vector<std::string>& row) {
        Transaction t;
        if (row.size() >= 10) {
            t.id = std::stoi(row[0]);
            t.type = row[1];
            t.productId = std::stoi(row[2]);
            t.productName = row[3];
            t.quantity = std::stoi(row[4]);
            t.oldStock = std::stoi(row[5]);
            t.newStock = std::stoi(row[6]);
            t.amount = std::stod(row[7]);
            t.date = row[8];
            t.status = row[9];
        }
        return t;
    }

    std::string toJson() const {
        std::string json = "{";
        json += "\"id\":" + std::to_string(id) + ",";
        json += "\"type\":\"" + type + "\",";
        json += "\"productId\":" + std::to_string(productId) + ",";
        json += "\"productName\":\"" + productName + "\",";
        json += "\"quantity\":" + std::to_string(quantity) + ",";
        json += "\"oldStock\":" + std::to_string(oldStock) + ",";
        json += "\"newStock\":" + std::to_string(newStock) + ",";
        json += "\"amount\":" + std::to_string(amount) + ",";
        json += "\"date\":\"" + date + "\",";
        json += "\"status\":\"" + status + "\"";
        json += "}";
        return json;
    }
};