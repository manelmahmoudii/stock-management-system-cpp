#ifndef JWT_H
#define JWT_H

#include <string>
#include <map>

namespace jwt {
    std::string generate(const std::map<std::string, std::string>& payload,
                         const std::string& secret,
                         long long expiresInSeconds);
    std::map<std::string, std::string> verify(const std::string& token,
                                              const std::string& secret);
}

#endif