#include "httplib.h"              // ← déjà correct car httplib.h est à la racine
#include "handlers/product_handler.h"
#include "handlers/user_handler.h"
#include <iostream>
#include <filesystem>

int main() {
    std::filesystem::create_directories("data");

    httplib::Server svr;

    // ─── CORS : OPTIONS preflight pour toutes les routes ───
// ✅ CORS GLOBAL (AVANT toutes les routes)
svr.set_pre_routing_handler([](const httplib::Request& req, httplib::Response& res) {

    // 🔥 gérer OPTIONS (preflight)
    if (req.method == "OPTIONS") {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

        // 🔥 récupère EXACTEMENT les headers demandés
        auto headers = req.get_header_value("Access-Control-Request-Headers");
        if (!headers.empty()) {
            res.set_header("Access-Control-Allow-Headers", headers);
        } else {
            res.set_header("Access-Control-Allow-Headers", "*");
        }

        res.status = 204;
        return httplib::Server::HandlerResponse::Handled;
    }

    // 🔥 pour toutes les autres requêtes
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "*");

    return httplib::Server::HandlerResponse::Unhandled;
});
    // ──────────── ROUTES PRODUITS ────────────
    svr.Get("/api/products", [](const httplib::Request&, httplib::Response& res) {
        res.set_content(ProductHandler::getAll(), "application/json");
    });
    svr.Get("/api/products/:id", [](const httplib::Request& req, httplib::Response& res) {
        int id = std::stoi(req.path_params.at("id"));
        auto [body, status] = ProductHandler::getOne(id);
        res.status = status;
        res.set_content(body, "application/json");
    });
    svr.Post("/api/products", [](const httplib::Request& req, httplib::Response& res) {
        res.set_content(ProductHandler::create(req.body), "application/json");
    });
    svr.Put("/api/products/:id", [](const httplib::Request& req, httplib::Response& res) {
        int id = std::stoi(req.path_params.at("id"));
        res.set_content(ProductHandler::update(id, req.body), "application/json");
    });
    svr.Delete("/api/products/:id", [](const httplib::Request& req, httplib::Response& res) {
        int id = std::stoi(req.path_params.at("id"));
        res.set_content(ProductHandler::remove(id), "application/json");
    });
    svr.Post("/api/products/:id/sell", [](const httplib::Request& req, httplib::Response& res) {
        int id = std::stoi(req.path_params.at("id"));
        res.set_content(ProductHandler::sell(id, req.body), "application/json");
    });

    // ──────────── ROUTES UTILISATEURS ────────────
svr.Post("/api/register", [](const httplib::Request& req, httplib::Response& res) {
    auto [body, status] = UserHandler::registerUser(req.body);
    res.status = status;
    res.set_content(body, "application/json");
});
svr.Post("/api/login", [](const httplib::Request& req, httplib::Response& res) {
    auto [body, status] = UserHandler::login(req.body);
    res.status = status;
    res.set_content(body, "application/json");
});
    svr.Get("/api/users", [](const httplib::Request& req, httplib::Response& res) {
        auto [body, status] = UserHandler::getAllUsers(req);
        res.status = status;
        res.set_content(body, "application/json");
    });
    svr.Delete("/api/users/:id", [](const httplib::Request& req, httplib::Response& res) {
        int id = std::stoi(req.path_params.at("id"));
        auto [body, status] = UserHandler::deleteUser(id, req);
        res.status = status;
        res.set_content(body, "application/json");
    });
    svr.Post("/api/setup", [](const httplib::Request&, httplib::Response& res) {
        auto [body, status] = UserHandler::setupDefaultAdmin();
        res.status = status;
        res.set_content(body, "application/json");
    });

    svr.Get("/", [](const httplib::Request&, httplib::Response& res) {
        res.set_content("Backend running", "text/plain");
    });

    std::cout << "Server running on http://localhost:8081\n";
    svr.listen("0.0.0.0", 8081);
    return 0;
}