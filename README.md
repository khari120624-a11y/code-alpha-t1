# MoodStream | Full Stack E-Commerce Store

Welcome to **The Accessories**, a complete premium Full Stack E-Commerce Store designed and built as a key capstone project for the **CodeAlpha Full Stack Development Internship**.

MoodStream is a highly responsive web application tailored for tech enthusiasts and workspace designers. It features dynamic catalog searches and filtering, full inventory control, simulated card payments, customer profiles, past order tracking, and a robust administrative control panel for CRUD inventory updates.

---

## 🚀 Key Features

* **Secure Authentication & Authorizations**:
  * Complete JWT-based credentials registration and user sign-in.
  * Hashed password storage using `bcryptjs`.
  * Middleware filters guarding customer panels (checkout, profile, history) and admin-only dashboard features.
* **Dynamic Product Catalog**:
  * Global Search Bar to filter items instantly.
  * Horizontal categories filter tabs (Audio, Keyboards, Wearables, Accessories).
  * Quick-sort selectors (Featured, Price: Low to High, Price: High to Low, Top Rated).
* **Inventory & Order Management**:
  * Item inventory checking matching stock levels (`countInStock`).
  * Full shopping cart checkout pipeline with auto-calculated items, taxes, shipping rules, and total amounts.
  * Interactive simulated credit-card payment process.
  * User profile details custom fields updating.
* **Premium Administrative Dashboard**:
  * Manage product catalog inventory items (Add new product, Edit, and Delete options).
  * System-wide customer orders visibility with status tracking.
  * Immediate dispatch button ("Ship") to mark customer orders as delivered.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React.js (Vite compiler)
* **Styling**: Tailwind CSS v3 & PostCSS
* **Backend Runtime**: Node.js & Express.js server
* **Database**: MongoDB & Mongoose ORM
* **Auth Scheme**: JSON Web Tokens (JWT) & Local Session storage
* **Icons Set**: Lucide-react
<img width="1868" height="1091" alt="Screenshot 2026-06-23 055905" src="https://github.com/user-attachments/assets/a87fda25-f902-4acd-bdfa-302e6e616067" />
<img width="1857" height="1092" alt="Screenshot 2026-06-23 055947" src="https://github.com/user-attachments/assets/3f4c7ff5-77f2-4aaa-9168-9429717c908b" />

---

## 📂 Project Structure

```
workspace/
├── backend/
│   ├── config/db.js                 # Mongoose Database Connection
│   ├── controllers/                 # Controllers handling HTTP APIs
│   ├── middleware/authMiddleware.js # JWT validation & Admin verification checks
│   ├── models/                      # MongoDB User, Product, & Order Mongoose Schemas
│   ├── routes/                      # Router routes paths configurations
│   ├── scripts/seed.js              # Database Seeder Tool
│   ├── .env                         # Backend Configuration Settings
│   ├── package.json                 # Backend Node dependencies
│   └── server.js                    # Express Application root entrypoint
└── frontend/
    ├── index.html                   # Entry point viewport configs
    ├── postcss.config.js            # Tailwind Parser setup
    ├── tailwind.config.js           # Theme overrides & screens content paths
    ├── vite.config.js               # Port configs & proxy middleware settings
    ├── package.json                 # Frontend dependencies list
    └── src/
        ├── index.css                # CSS styles, glassmorphism templates, & animations
        ├── main.jsx                 # Vite bootstrap script
        ├── App.jsx                  # Main application routes wrapper
        ├── components/              # Navbar, Footer, protected route guards, spinners
        ├── context/                 # Context providers managing Auth & Cart state
        └── pages/                   # Views: Home, details, cart, checkout, profile, admin
```

---

## ⚙️ Setup & Installation Instructions

Follow these instructions to configure and run MoodStream on your system.

### Prerequisites
* [Node.js](https://nodejs.org/) installed (v18 or higher recommended).
* [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running locally on port `27017` (or access to a MongoDB Atlas cluster URI).

### Step 1: Run the Backend Service

1. Open a terminal pane and navigate into the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the environment variables:
   * Verify the `.env` settings are configured correctly. By default, it connects to a local database named `moodstream` (`mongodb://127.0.0.1:27017/moodstream`).
4. **Seed the database** (Creates seed accounts and populates premium products list):
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   * The server runs on port **5000** by default.

### Step 2: Run the Frontend Client

1. Open a separate terminal pane and navigate into the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Boot the Vite hot-reloading development server:
   ```bash
   npm run dev
   ```
   * The client launches on port **3000** and automatically proxies api queries to `http://localhost:5000`.

---

## 🔑 Seeding User Accounts

The seeding script populates the database with two mock user accounts so you can test the application instantly:

| Account Type | Email Address | Password | Privileges / Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123` | Can access Admin Dashboard, CRUD products, mark orders as delivered. |
| **Customer** | `john@example.com` | `user123` | Can search products, add/remove items to cart, checkout orders, update profile. |

---

## 📝 License

This project was built for educational purposes in fulfillment of the **CodeAlpha Full Stack Development Internship**.
