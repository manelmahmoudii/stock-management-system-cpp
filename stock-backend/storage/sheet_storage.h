#pragma once
#include <string>
#include <vector>
#include <fstream>
#include <sstream>

// Représente une ligne du fichier CSV comme un vecteur de colonnes
using Row = std::vector<std::string>;

class SheetStorage {
public:
    // Lit toutes les lignes d'un fichier CSV
    static std::vector<Row> readAll(const std::string& filename) {
        std::vector<Row> rows;
        std::ifstream file(filename);
        
        if (!file.is_open()) return rows; // fichier inexistant → retourne vide
        
        std::string line;
        bool firstLine = true;
        
        while (std::getline(file, line)) {
            if (firstLine) { firstLine = false; continue; } // skip header
            if (line.empty()) continue;
            
            Row row;
            std::stringstream ss(line);
            std::string cell;
            
            while (std::getline(ss, cell, ',')) {
                row.push_back(cell);
            }
            rows.push_back(row);
        }
        return rows;
    }

    // Écrit toutes les lignes dans le fichier CSV (remplace tout)
    static void writeAll(const std::string& filename,
                         const std::string& header,
                         const std::vector<Row>& rows) {
        std::ofstream file(filename);
        file << header << "\n";
        for (const auto& row : rows) {
            for (size_t i = 0; i < row.size(); i++) {
                if (i > 0) file << ",";
                file << row[i];
            }
            file << "\n";
        }
    }
};