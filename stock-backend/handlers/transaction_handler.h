#pragma once
#include "../models/Transaction.h"
#include "../storage/sheet_storage.h"
#include <vector>
#include <string>
#include <sstream>
#include <chrono>
#include <ctime>
#include <iomanip>
#include <sys/stat.h>  // Pour créer le dossier sur Windows

#ifdef _WIN32
#include <direct.h>  // pour mkdir sur Windows
#define MKDIR(path) _mkdir(path)
#else
#include <sys/stat.h>
#define MKDIR(path) mkdir(path, 0777)
#endif

const std::string TRANSACTIONS_FILE = "data/transactions.csv";
const std::string TRANSACTIONS_HEADER = "id,type,productId,productName,quantity,oldStock,newStock,amount,date,status";

class TransactionHandler {
private:
    static void ensureDataDirectory() {
        struct stat info;
        if (stat("data", &info) != 0) {
            // Le dossier n'existe pas, on le crée
            MKDIR("data");
        }
    }

    static int getNextId() {
        ensureDataDirectory();
        auto rows = SheetStorage::readAll(TRANSACTIONS_FILE);
        int maxId = 0;
        for (const auto& row : rows) {
            if (!row.empty()) {
                int id = std::stoi(row[0]);
                if (id > maxId) maxId = id;
            }
        }
        return maxId + 1;
    }

    static std::string getCurrentDate() {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        std::stringstream ss;
        ss << std::put_time(std::localtime(&time), "%Y-%m-%d %H:%M:%S");
        return ss.str();
    }

public:
    // Enregistre une transaction
    static void logTransaction(const std::string& type, int productId, const std::string& productName,
                               int quantity, int oldStock, int newStock, double amount, const std::string& status) {
        ensureDataDirectory();
        
        auto rows = SheetStorage::readAll(TRANSACTIONS_FILE);
        
        Transaction t;
        t.id = getNextId();
        t.type = type;
        t.productId = productId;
        t.productName = productName;
        t.quantity = quantity;
        t.oldStock = oldStock;
        t.newStock = newStock;
        t.amount = amount;
        t.date = getCurrentDate();
        t.status = status;
        
        rows.push_back(t.toRow());
        SheetStorage::writeAll(TRANSACTIONS_FILE, TRANSACTIONS_HEADER, rows);
    }

    // Récupère toutes les transactions
    static std::string getAll() {
        ensureDataDirectory();
        auto rows = SheetStorage::readAll(TRANSACTIONS_FILE);
        std::string json = "[";
        for (size_t i = 0; i < rows.size(); i++) {
            if (i > 0) json += ",";
            json += Transaction::fromRow(rows[i]).toJson();
        }
        json += "]";
        return json;
    }

    // Récupère les transactions pour un produit spécifique
    static std::string getByProductId(int productId) {
        ensureDataDirectory();
        auto rows = SheetStorage::readAll(TRANSACTIONS_FILE);
        std::string json = "[";
        bool first = true;
        for (const auto& row : rows) {
            if (!row.empty() && std::stoi(row[2]) == productId) {
                if (!first) json += ",";
                json += Transaction::fromRow(row).toJson();
                first = false;
            }
        }
        json += "]";
        return json;
    }
};