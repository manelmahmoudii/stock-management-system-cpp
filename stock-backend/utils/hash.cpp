#include "hash.h"
#include <cstdint>
#include <cstring>
#include <sstream>
#include <iomanip>
#include <vector>

class SHA256 {
public:
    SHA256() { init(); }
    void init();
    void update(const uint8_t* data, size_t len);
    void final(uint8_t* digest);
    
private:
    uint32_t h[8];
    uint64_t bit_len;
    uint8_t buffer[64];
    size_t buf_len;
    
    static uint32_t rotr(uint32_t x, uint32_t n) { return (x >> n) | (x << (32 - n)); }
    static uint32_t ch(uint32_t x, uint32_t y, uint32_t z) { return (x & y) ^ (~x & z); }
    static uint32_t maj(uint32_t x, uint32_t y, uint32_t z) { return (x & y) ^ (x & z) ^ (y & z); }
    static uint32_t sigma0(uint32_t x) { return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22); }
    static uint32_t sigma1(uint32_t x) { return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25); }
    static uint32_t gamma0(uint32_t x) { return rotr(x, 7) ^ rotr(x, 18) ^ (x >> 3); }
    static uint32_t gamma1(uint32_t x) { return rotr(x, 17) ^ rotr(x, 19) ^ (x >> 10); }
    void transform();
};

void SHA256::init() {
    h[0] = 0x6a09e667;
    h[1] = 0xbb67ae85;
    h[2] = 0x3c6ef372;
    h[3] = 0xa54ff53a;
    h[4] = 0x510e527f;
    h[5] = 0x9b05688c;
    h[6] = 0x1f83d9ab;
    h[7] = 0x5be0cd19;
    bit_len = 0;
    buf_len = 0;
}

void SHA256::transform() {
    static const uint32_t K[64] = {
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
        0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
        0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
        0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    };
    
    uint32_t W[64];
    for (int i = 0; i < 16; ++i) {
        W[i] = (buffer[i*4] << 24) | (buffer[i*4+1] << 16) | (buffer[i*4+2] << 8) | buffer[i*4+3];
    }
    for (int i = 16; i < 64; ++i) {
        W[i] = gamma1(W[i-2]) + W[i-7] + gamma0(W[i-15]) + W[i-16];
    }
    
    uint32_t a = h[0], b = h[1], c = h[2], d = h[3];
    uint32_t e = h[4], f = h[5], g = h[6], hh = h[7];
    
    for (int i = 0; i < 64; ++i) {
        uint32_t t1 = hh + sigma1(e) + ch(e, f, g) + K[i] + W[i];
        uint32_t t2 = sigma0(a) + maj(a, b, c);
        hh = g;
        g = f;
        f = e;
        e = d + t1;
        d = c;
        c = b;
        b = a;
        a = t1 + t2;
    }
    
    h[0] += a;
    h[1] += b;
    h[2] += c;
    h[3] += d;
    h[4] += e;
    h[5] += f;
    h[6] += g;
    h[7] += hh;
}

void SHA256::update(const uint8_t* data, size_t len) {
    for (size_t i = 0; i < len; ++i) {
        buffer[buf_len++] = data[i];
        if (buf_len == 64) {
            transform();
            bit_len += 512;
            buf_len = 0;
        }
    }
}

void SHA256::final(uint8_t* digest) {
    bit_len += buf_len * 8;
    buffer[buf_len++] = 0x80;
    
    if (buf_len > 56) {
        while (buf_len < 64) buffer[buf_len++] = 0;
        transform();
        buf_len = 0;
    }
    
    while (buf_len < 56) buffer[buf_len++] = 0;
    
    for (int i = 0; i < 8; ++i) {
        buffer[56 + i] = (bit_len >> (56 - i * 8)) & 0xFF;
    }
    
    transform();
    
    for (int i = 0; i < 32; ++i) {
        digest[i] = (h[i / 4] >> (24 - (i % 4) * 8)) & 0xFF;
    }
}

std::string sha256(const std::string& str) {
    uint8_t digest[32];
    SHA256 ctx;
    ctx.update(reinterpret_cast<const uint8_t*>(str.c_str()), str.size());
    ctx.final(digest);
    
    std::stringstream ss;
    for (int i = 0; i < 32; ++i) {
        ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(digest[i]);
    }
    return ss.str();
}