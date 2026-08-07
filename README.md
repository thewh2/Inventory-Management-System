# Inventory Management System

A full-stack web application built for managing products and suppliers. Developed as a university assignment by **Chandan Kumar Thakur**.

## Technologies Used
- **Frontend:** React, React Router, Axios, vanilla CSS
- **Backend:** Node.js, Express.js
- **Database:** SQLite with Sequelize ORM
- **Security:** JWT Authentication, bcrypt password hashing
- **File Upload:** Multer

## Project Structure
- `frontend/`: Contains the React application.
- `backend/`: Contains the Node.js Express API and SQLite database.

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on port 5000):
   ```bash
   npm start
   ```
   *Note: The database (`database.sqlite`) will be created automatically on the first run, and a default admin user will be seeded.*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:5173`.

## Default Credentials
To access the system, use the following credentials on the login page:
- **Username:** `admin`
- **Password:** `admin123`

## Core Features
- **Authentication:** Secure login system using JSON Web Tokens (JWT).
- **Product Management:** Add, view, edit, and delete products. Supports image uploads.
- **Supplier Management:** Keep track of supplier details (name, email, phone).
- **Low Stock Alerts:** Products with a quantity less than 5 are automatically highlighted in red.
- **Search and Filter:** Search products by name and filter them by their respective supplier.
