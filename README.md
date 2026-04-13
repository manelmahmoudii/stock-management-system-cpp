# 🏪 Stock Management System (C++)

## 📌 Description

This project is a **Stock Management System** developed in C++.
It allows managing products in a store by tracking quantities, handling sales and deliveries, and generating alerts when stock becomes low.

---

## 🎯 Features

* Add new products
* Sell products (decrease stock)
* Deliver products (increase stock)
* Display available stock
* Generate low-stock alerts
* View transaction history

---

## 👥 Actors

### 🧑‍💼 Manager

* Add products
* Restock (delivery)
* View stock
* View history
* Receive alerts

### 🧑‍💻 Seller

* Sell products

---

## 🧱 Project Structure

* `Produit` → represents a product
* `Transaction` → represents an operation (sale or delivery)
* `Stock` → manages products and system logic
* `main.cpp` → user interface (console menus)

---

## ⚙️ How It Works

1. The user chooses a role (Manager or Seller)
2. Performs actions through a menu
3. The system updates stock automatically
4. Alerts are generated if stock < minimum threshold
5. All operations are saved in history

---

## 📦 Example

Product: Milk

* Initial quantity: 20
* After sale: 15
* After delivery: 30

---

## 🚀 How to Run

1. Compile the program:

```bash
g++ main.cpp -o stock
```

2. Run:

```bash
./stock
```

---

## 📚 Technologies
### 🧠 Backend (Core System)
- C++
- Object-Oriented Programming (OOP)
- Standard Template Library (STL)
  - vector
  - string
  - iostream

### 🎨 Frontend (Extension)
- React.js
- HTML / CSS / JavaScript  
(Used to provide a user-friendly interface for the system)

### 🗄️ Database (Extension)
- MongoDB  
(Used to store products and transaction history persistently)

### 🔄 Architecture
- Hybrid system:
  - C++ for core business logic
  - React for frontend interface
  - MongoDB for data storage
---

## ✍️ Authors

* Meissen Miled
* Eya Zayati
* Manel Mahmoudi
---

## 📌 Note

This project is developed as part of a university assignment.
