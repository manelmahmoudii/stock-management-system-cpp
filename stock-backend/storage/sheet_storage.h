#ifndef SHEET_STORAGE_H
#define SHEET_STORAGE_H

#include <string>
#include <vector>
#include <fstream>
#include <sstream>

using Row = std::vector<std::string>;

class SheetStorage {
public:
    static std::vector<Row> readAll(const std::string& filename) {
        std::vector<Row> rows;
        std::ifstream file(filename);
        if (!file.is_open()) return rows;

        std::string line;
        bool firstLine = true;

        while (std::getline(file, line)) {
            if (!line.empty() && line.back() == '\r') line.pop_back();
            if (firstLine) { firstLine = false; continue; }
            if (line.empty()) continue;

            Row row;
            std::stringstream ss(line);
            std::string cell;

            while (std::getline(ss, cell, ',')) {
                if (!cell.empty() && cell.back() == '\r') cell.pop_back();
                row.push_back(cell);
            }
            rows.push_back(row);
        }
        return rows;
    }

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

#endif