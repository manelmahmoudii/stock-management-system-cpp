#include "jwt.h"
#include "hash.h"
#include <sstream>
#include <ctime>
#include <iomanip>
#include <algorithm>
#include <vector>
#include <cstdint>
#include <iostream>

static const std::string base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

static std::string base64_encode(const std::string& data) {
    std::string out;
    int i = 0;
    unsigned char char_array_3[3];
    unsigned char char_array_4[4];
    int in_len = data.size();
    const unsigned char* bytes_to_encode = reinterpret_cast<const unsigned char*>(data.c_str());

    while (in_len--) {
        char_array_3[i++] = *(bytes_to_encode++);
        if (i == 3) {
            char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
            char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
            char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);
            char_array_4[3] = char_array_3[2] & 0x3f;
            for(i = 0; i < 4; i++) out += base64_chars[char_array_4[i]];
            i = 0;
        }
    }
    if (i) {
        for(int j = i; j < 3; j++) char_array_3[j] = '\0';
        char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
        char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
        char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);
        char_array_4[3] = char_array_3[2] & 0x3f;
        for (int j = 0; j < i + 1; j++) out += base64_chars[char_array_4[j]];
        while (i++ < 3) out += '=';
    }
    return out;
}

static std::string base64UrlEncode(const std::string& data) {
    std::string encoded = base64_encode(data);
    std::replace(encoded.begin(), encoded.end(), '+', '-');
    std::replace(encoded.begin(), encoded.end(), '/', '_');
    encoded.erase(std::remove(encoded.begin(), encoded.end(), '='), encoded.end());
    return encoded;
}

static std::string base64UrlDecode(const std::string& data) {
    std::string decoded = data;
    std::replace(decoded.begin(), decoded.end(), '-', '+');
    std::replace(decoded.begin(), decoded.end(), '_', '/');
    while (decoded.size() % 4) decoded += '=';
    
    std::string out;
    std::vector<int> T(256, -1);
    for (int i = 0; i < 64; i++) T[base64_chars[i]] = i;
    
    for (size_t i = 0; i < decoded.size(); i += 4) {
        int a = T[decoded[i]];
        int b = T[decoded[i+1]];
        int c = T[decoded[i+2]];
        int d = T[decoded[i+3]];
        if (a == -1 || b == -1 || (c == -1 && decoded[i+2] != '=') || (d == -1 && decoded[i+3] != '='))
            break;
        out.push_back((a << 2) | (b >> 4));
        if (decoded[i+2] != '=')
            out.push_back(((b & 0x0f) << 4) | (c >> 2));
        if (decoded[i+3] != '=')
            out.push_back(((c & 0x03) << 6) | d);
    }
    return out;
}

static std::string hmacSha256(const std::string& key, const std::string& data) {
    const size_t block_size = 64;
    std::vector<uint8_t> key_bytes(key.begin(), key.end());
    if (key_bytes.size() > block_size) {
        std::string hashed_key = sha256(key);
        key_bytes.assign(hashed_key.begin(), hashed_key.end());
    }
    std::vector<uint8_t> o_key_pad(block_size, 0x5c);
    std::vector<uint8_t> i_key_pad(block_size, 0x36);
    for (size_t i = 0; i < key_bytes.size(); ++i) {
        o_key_pad[i] ^= key_bytes[i];
        i_key_pad[i] ^= key_bytes[i];
    }
    std::string inner_data(i_key_pad.begin(), i_key_pad.end());
    inner_data += data;
    std::string inner_hash = sha256(inner_data);
    std::string outer_data(o_key_pad.begin(), o_key_pad.end());
    outer_data += inner_hash;
    return sha256(outer_data);
}

namespace jwt {

std::string generate(const std::map<std::string, std::string>& payload,
                     const std::string& secret,
                     long long expiresInSeconds) {
    std::string header = R"({"alg":"HS256","typ":"JWT"})";
    std::string encodedHeader = base64UrlEncode(header);
    
    std::string payloadStr = "{";
    bool first = true;
    for (const auto& p : payload) {
        if (!first) payloadStr += ",";
        payloadStr += "\"" + p.first + "\":\"" + p.second + "\"";
        first = false;
    }
    long long exp = std::time(nullptr) + expiresInSeconds;
    payloadStr += (first ? "" : ",") + std::string("\"exp\":") + std::to_string(exp);
    payloadStr += "}";
    std::string encodedPayload = base64UrlEncode(payloadStr);
    
    std::string signatureInput = encodedHeader + "." + encodedPayload;
    std::string signature = hmacSha256(secret, signatureInput);
    std::string encodedSignature = base64UrlEncode(signature);
    
    return encodedHeader + "." + encodedPayload + "." + encodedSignature;
}

std::map<std::string, std::string> verify(const std::string& token,
                                          const std::string& secret) {
    std::map<std::string, std::string> result;
    
    size_t firstDot = token.find('.');
    size_t lastDot = token.rfind('.');
    if (firstDot == std::string::npos || lastDot == firstDot) {
        std::cout << "JWT: Invalid format" << std::endl;
        return result;
    }
    
    std::string encodedHeader = token.substr(0, firstDot);
    std::string encodedPayload = token.substr(firstDot + 1, lastDot - firstDot - 1);
    std::string encodedSignature = token.substr(lastDot + 1);
    
    // Vérifier la signature
    std::string signatureInput = encodedHeader + "." + encodedPayload;
    std::string expectedSignature = hmacSha256(secret, signatureInput);
    std::string encodedExpected = base64UrlEncode(expectedSignature);
    
    if (encodedSignature != encodedExpected) {
        std::cout << "JWT: Invalid signature" << std::endl;
        return result;
    }
    
    // Décoder le payload
    std::string decodedPayload = base64UrlDecode(encodedPayload);
    std::cout << "JWT: Decoded payload: " << decodedPayload << std::endl;
    
    // Extraire les champs (parser JSON simplifié)
    auto extractValue = [&](const std::string& key) -> std::string {
        std::string search = "\"" + key + "\":";
        size_t pos = decodedPayload.find(search);
        if (pos == std::string::npos) return "";
        pos += search.length();
        
        // Ignorer les espaces
        while (pos < decodedPayload.size() && (decodedPayload[pos] == ' ' || decodedPayload[pos] == '\t')) pos++;
        
        if (decodedPayload[pos] == '"') {
            // Valeur string
            pos++;
            size_t end = decodedPayload.find('"', pos);
            if (end == std::string::npos) return "";
            return decodedPayload.substr(pos, end - pos);
        } else {
            // Valeur numérique
            size_t end = decodedPayload.find_first_of(",}", pos);
            if (end == std::string::npos) end = decodedPayload.size();
            return decodedPayload.substr(pos, end - pos);
        }
    };
    
    result["id"] = extractValue("id");
    result["email"] = extractValue("email");
    result["role"] = extractValue("role");
    result["exp"] = extractValue("exp");
    
    // Vérifier expiration
    if (result.count("exp") && !result["exp"].empty()) {
        long long exp = std::stoll(result["exp"]);
        long long now = std::time(nullptr);
        if (exp < now) {
            std::cout << "JWT: Token expired" << std::endl;
            result.clear();
        }
    }
    
    return result;
}

}