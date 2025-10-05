WOM Finance Book Store API
API untuk sistem penjualan buku dengan fitur authentication, authorization, cart management, dan checkout.

Authentication & Authorization

✅ User roles: Customer & Admin
✅ Login dengan email & password
✅ Password hashing menggunakan bcrypt
✅ JWT access token dengan masa berlaku 1 jam
✅ Single device active session (logout otomatis di device lain)
✅ Token disimpan di Redis

Customer Features

✅ Melihat daftar buku yang ready stock
✅ Melihat detail buku
✅ Menambahkan buku ke keranjang (validasi stock)
✅ Menghapus buku dari keranjang
✅ Checkout pembayaran
✅ API callback untuk update status pembayaran

Admin Features

✅ Melihat semua buku (termasuk out of stock)
✅ Melihat list transaksi dengan status pembayaran
✅ Menambah buku baru
✅ Update stock buku (tambah/kurangi)
✅ Hapus buku (soft delete)
✅ Laporan penjualan per buku

Technical Features

✅ Error handling konsisten
✅ Error logging ke database
✅ Rate limiting
✅ Race condition handling dengan database locking

Tech Stack

- Node.js - Runtime
- Express - Web framework
- Sequelize - ORM
- MySQL - Database
- Redis - Session storage
- JWT - Authentication
- bcryptjs - Password hashing

Installation

1. Clone repository

- git clone <repository-url>
- cd wom-bookstore-api

2. Install dependencies

npm install

3. Setup environment variables

.env (Edit .env file dengan konfigurasi database dan Redis Anda.)

4. Create MySQL database

CREATE DATABASE wom_bookstore;

5. Install dan jalankan Redis

# macOS

- brew install redis
- brew services start redis

5. Run seeders (optional)

node seeders/index.js

6. Run application

# Development

- npm run dev

Project Structure

wom-bookstore-api/
├── config/
│ ├── database.js  
│ └── redis.js  
├── controllers/
│ ├── authController.js
│ ├── bookController.js
│ ├── cartController.js
│ └── checkoutController.js
├── helpers/
│ ├── jwt.js  
│ └── response.js  
├── middleware/
│ ├── auth.js  
│ └── errorHandler.js  
├── models/
│ ├── index.js
│ ├── user.js
│ ├── book.js
│ ├── cart.js
│ ├── cartItem.js
│ ├── transaction.js
│ ├── transactionItem.js
│ └── errorLog.js
├── routes/
│ ├── index.js
│ ├── authRoutes.js
│ ├── bookRoutes.js
│ ├── cartRoutes.js
│ ├── checkoutRoutes.js
│ └── adminRoutes.js
├── seeders/
│ ├── index.js # Main seeder
│ ├── userSeeder.js # User seeder
│ └── bookSeeder.js # Book seeder
├── services/
│ ├── authService.js
│ ├── bookService.js
│ ├── cartService.js
│ └── checkoutService.js
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md

API Endpoints

Security Features

1. Password Hashing: Passwords di-hash menggunakan bcrypt dengan salt rounds 10
2. JWT Authentication: Token expire dalam 1 jam
3. Single Device Session: Hanya 1 device aktif per user
4. Rate Limiting: 100 requests per 15 menit per IP
5. Database Locking: Mencegah race condition pada transaksi
6. Error Logging: Semua error dicatat ke database untuk audit

Testing

1. Gunakan Postman atau tools API testing lainnya. Import collection dari dokumentasi API.
2. Default Test Accounts (after running seeders)
3. Admin Account:

- Email: admin@womfinance.com
- Password: admin123

Customer Accounts:

- Email: john@gmail.com | Password: customer123

Seeded Data
Seeder akan membuat:

- 2 users (1 admin + 1 customers)
- 10 books dengan berbagai kategori:
  - Technology (2 books)
  - Business (3 books)
  - Personal Development ( 2 books)
  - Fiction (3 books)

Database Schema
Users

id (PK)
name
email (unique)
password (hashed)
role (customer/admin)
deviceId
lastLoginAt

Books

id (PK)
title
author
isbn (unique)
description
price
stock
publisher
publishedYear
category
isActive

Carts

id (PK)
userId (FK)

CartItems

id (PK)
cartId (FK)
bookId (FK)
quantity
price

Transactions

id (PK)
transactionNumber (unique)
userId (FK)
totalAmount
status (pending/success/failed)
paymentMethod
paidAt

TransactionItems

id (PK)
transactionId (FK)
bookId (FK)
quantity
price
subtotal

ErrorLogs

id (PK)
userId
method
url
statusCode
errorMessage
errorStack
userAgent
ipAddress

Notes

- Pastikan MySQL dan Redis sudah terinstall dan berjalan
- Default JWT secret harus diganti di production
- Rate limiting dapat disesuaikan di index.js
- Untuk development, gunakan npm run dev dengan nodemon
- Database akan auto-sync saat aplikasi pertama kali dijalankan
