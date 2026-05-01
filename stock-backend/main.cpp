#include "httplib.h"
#include "handlers/product_handler.h"
#include <iostream>
#include <filesystem>

int main() {
    // Crée le dossier data/ si inexistant
    std::filesystem::create_directories("data");

    httplib::Server svr;

    // ── CORS : autorise le frontend à appeler le backend ──────────────
    svr.set_default_headers({
        {"Access-Control-Allow-Origin", "*"},
        {"Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"},
        {"Access-Control-Allow-Headers", "Content-Type"}
    });

    // Preflight OPTIONS (pour CORS)
    svr.Options(".*", [](const httplib::Request&, httplib::Response& res) {
        res.status = 204;
    });

    // ── GET /api/products ─── liste tous les produits ─────────────────
    svr.Get("/api/products", [](const httplib::Request&, httplib::Response& res) {
        res.set_content(ProductHandler::getAll(), "application/json");
    });

       // ── GET /api/products/:id ─── récupère un produit ─────────────
svr.Get("/api/products/:id", [](const Request& req, Response& res) {
    int id = std::stoi(req.path_params.at("id"));
    auto [body, status] = ProductHandler::getOne(id);
    res.status = status;
    res.set_content(body, "application/json");
});

    // ── POST /api/products ─── créer un produit ───────────────────────
    svr.Post("/api/products", [](const httplib::Request& req, httplib::Response& res) {
        res.set_content(ProductHandler::create(req.body), "application/json");
    });

    // ── PUT /api/products/:id ─── modifier un produit ─────────────────
    svr.Put("/api/products/:id", [](const httplib::Request& req, httplib::Response& res) {
        int id = std::stoi(req.path_params.at("id"));
        res.set_content(ProductHandler::update(id, req.body), "application/json");
    });

    // ── DELETE /api/products/:id ─── supprimer un produit ─────────────
    svr.Delete("/api/products/:id", [](const httplib::Request& req, httplib::Response& res) {
        int id = std::stoi(req.path_params.at("id"));
        res.set_content(ProductHandler::remove(id), "application/json");
    });

    // ── POST /api/products/:id/sell ─── vendre un produit ─────────────
    svr.Post("/api/products/:id/sell", [](const httplib::Request& req, httplib::Response& res) {
        int id = std::stoi(req.path_params.at("id"));
        res.set_content(ProductHandler::sell(id, req.body), "application/json");
    });

    svr.Get("/", [](const httplib::Request&, httplib::Response& res) {
    res.set_content("OK TEST ROUTE WORKS", "text/plain");
});
    printf("Backend running on http://localhost:8081\n");
    svr.listen("0.0.0.0", 8081);

    return 0;
}