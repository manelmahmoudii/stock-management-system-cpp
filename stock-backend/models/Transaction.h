#pragma once
#include <string>
#include <vector>

class Transaction {
public:
    int id;
    std::string type;
    int productId;
    std::string productName;
    int quantity;
    int oldStock;
    int newStock;
    double amount;
    std::string date;
    std::string status;
    int userId;
    std::string userEmail;

    Transaction() : id(0), productId(0), quantity(0), oldStock(0), newStock(0), amount(0), userId(0) {}

    Transaction(int id, const std::string& type, int productId, const std::string& productName,
                int quantity, int oldStock, int newStock, double amount, const std::string& date, 
                const std::string& status, int userId, const std::string& userEmail)
        : id(id), type(type), productId(productId), productName(productName),
          quantity(quantity), oldStock(oldStock), newStock(newStock), amount(amount), 
          date(date), status(status), userId(userId), userEmail(userEmail) {}

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
            status,
            std::to_string(userId),
            userEmail
        };
    }

    static Transaction fromRow(const std::vector<std::string>& row) {
        Transaction t;
        
        // Vérifier que la ligne est valide et a au moins 12 colonnes
        if (row.size() >= 12 && !row[0].empty() && row[0] != "id") {
            try {
                int id = std::stoi(row[0]);
                // Ignorer les ID 0 (invalides)
                if (id == 0) return t;
                
                t.id = id;
                t.type = row[1];
                t.productId = std::stoi(row[2]);
                t.productName = row[3];
                t.quantity = std::stoi(row[4]);
                t.oldStock = std::stoi(row[5]);
                t.newStock = std::stoi(row[6]);
                t.amount = std::stod(row[7]);
                t.date = row[8];
                t.status = row[9];
                t.userId = std::stoi(row[10]);
                t.userEmail = row.size() > 11 ? row[11] : "";
            } catch (const std::exception& e) {
                // En cas d'erreur, retourner une transaction vide
                return Transaction();
            }
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
        json += "\"status\":\"" + status + "\",";
        json += "\"userId\":" + std::to_string(userId) + ",";
        json += "\"userEmail\":\"" + userEmail + "\"";
        json += "}";
        return json;
    }
};