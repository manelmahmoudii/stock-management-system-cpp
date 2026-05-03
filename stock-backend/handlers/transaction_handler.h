#pragma once
#include "../models/Transaction.h"
#include "../storage/sheet_storage.h"
#include <vector>
#include <string>
#include <sstream>
#include <chrono>
#include <ctime>
#include <iomanip>
#include <sys/stat.h>
#include <iostream>

#ifdef _WIN32
#include <direct.h>
#define MKDIR(path) _mkdir(path)
#else
#include <sys/stat.h>
#define MKDIR(path) mkdir(path, 0777)
#endif

const std::string TRANSACTIONS_FILE = "data/transactions.csv";
const std::string TRANSACTIONS_HEADER = "id,type,productId,productName,quantity,oldStock,newStock,amount,date,status,userId,userEmail";

class TransactionHandler {
private:
    static void ensureDataDirectory() {
        struct stat info;
        if (stat("data", &info) != 0) {
            MKDIR("data");
        }
    }

    static void ensureFileExists() {
        ensureDataDirectory();
        // Vérifier si le fichier existe et a l'en-tête correct
        std::ifstream file(TRANSACTIONS_FILE);
        if (!file.is_open()) {
            // Créer le fichier avec l'en-tête
            std::vector<Row> emptyRows;
            SheetStorage::writeAll(TRANSACTIONS_FILE, TRANSACTIONS_HEADER, emptyRows);
            std::cout << "Created new transactions file with header" << std::endl;
        }
        file.close();
    }

    static int getNextId() {
        ensureFileExists();
        auto rows = SheetStorage::readAll(TRANSACTIONS_FILE);
        int maxId = 0;
        for (const auto& row : rows) {
            if (!row.empty() && row.size() >= 1) {
                try {
                    int id = std::stoi(row[0]);
                    if (id > maxId) maxId = id;
                } catch (...) {}
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
    static void logTransaction(const std::string& type, int productId, const std::string& productName,
                               int quantity, int oldStock, int newStock, double amount, 
                               const std::string& status, int userId = 0, const std::string& userEmail = "") {
        ensureFileExists();
        
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
        t.userId = userId;
        t.userEmail = userEmail.empty() ? "system" : userEmail;
        
        rows.push_back(t.toRow());
        SheetStorage::writeAll(TRANSACTIONS_FILE, TRANSACTIONS_HEADER, rows);
        
        std::cout << "Transaction logged: " << t.id << " - " << type << " - " << productName << std::endl;
    }

    static std::string getAll() {
        ensureFileExists();
        auto rows = SheetStorage::readAll(TRANSACTIONS_FILE);
        
        std::cout << "=== getAll() called ===" << std::endl;
        std::cout << "Rows count: " << rows.size() << std::endl;
        
        std::string json = "[";
        bool first = true;
        
        for (const auto& row : rows) {
            // Afficher la taille de la ligne pour debug
            std::cout << "Row size: " << row.size() << std::endl;
            
            // Ignorer l'en-tête ou les lignes vides
            if (row.empty()) continue;
            if (row.size() >= 1 && row[0] == "id") continue;
            
            // Accepter les lignes avec 12 colonnes
            if (row.size() < 12) {
                std::cout << "Skipping row with " << row.size() << " columns (need 12)" << std::endl;
                continue;
            }
            
            try {
                int id = std::stoi(row[0]);
                if (id == 0) {
                    std::cout << "Skipping row with id=0" << std::endl;
                    continue;
                }
                
                Transaction t = Transaction::fromRow(row);
                if (t.id == 0) {
                    std::cout << "fromRow returned invalid transaction" << std::endl;
                    continue;
                }
                
                if (!first) json += ",";
                first = false;
                json += t.toJson();
                
                std::cout << "Added transaction: id=" << t.id << ", type=" << t.type << std::endl;
            } catch (const std::exception& e) {
                std::cout << "Error parsing row: " << e.what() << std::endl;
                continue;
            }
        }
        json += "]";
        
        std::cout << "Final JSON length: " << json.length() << std::endl;
        return json;
    }

    static std::string getByProductId(int productId) {
        ensureFileExists();
        auto rows = SheetStorage::readAll(TRANSACTIONS_FILE);
        std::string json = "[";
        bool first = true;
        for (const auto& row : rows) {
            if (!row.empty() && row.size() >= 3) {
                try {
                    if (std::stoi(row[2]) == productId) {
                        Transaction t = Transaction::fromRow(row);
                        if (t.id != 0) {
                            if (!first) json += ",";
                            json += t.toJson();
                            first = false;
                        }
                    }
                } catch (...) {}
            }
        }
        json += "]";
        return json;
    }
};