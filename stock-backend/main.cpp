#include "httplib.h"
#include <iostream>

using namespace httplib;

int main() {
    Server svr;
    
    svr.Get("/", [](const Request&, Response& res) {
        res.set_content("HELLO C++ BACKEND WORKS", "text/plain");
    });
    
    svr.Get("/api/test", [](const Request&, Response& res) {
        res.set_content("{\"status\":\"ok\"}", "application/json");
    });
    
    printf("Server starting on http://localhost:8081\n");
    fflush(stdout);
    
    bool ok = svr.listen("0.0.0.0", 8081);
    
    printf("listen() returned: %s\n", ok ? "true" : "false");
    fflush(stdout);
    
    return 0;
}