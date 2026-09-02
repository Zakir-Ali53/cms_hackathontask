# 🚀 Smart Complaint Management System (CMS) - Backend API

This is a production-grade, enterprise-ready, and highly secure Backend API for a **Smart Complaint Management System (CMS)** built using the **MERN Stack** (Node.js, Express.js, and MongoDB with Mongoose ODM). It features a complete role-based workflow for Users/Students and Admins, robust serverless optimizations, and airtight system-level security architecture.

## 🛠️ Tech Stack & Architecture
* **Runtime Environment:** Node.js
* **Backend Framework:** Express.js
* **Database:** MongoDB Atlas (Cloud Cluster)
* **Object Data Modeling (ODM):** Mongoose
* **Deployment Platform:** Vercel (Serverless Functions)

---

## ✨ Features Checklist & Implementation Details (Step 25 Compliant)

### 🔒 1. Core Security & Authentication Infrastructure
* **Secure Auth Gateway:** Fully functional `Register / Login` auth flow.
* **Password Hashing:** Implemented one-way cryptographic password hashing via `bcrypt` to protect user credentials at rest.
* **Airtight Session Tokens:** `JWT (JSON Web Tokens) Authentication` for stateless, signed, and secure user sessions.
* **Backend Role Protection:** Strict system-wide authorization middleware ensuring `Role-Based Access Control (RBAC)` across all protected endpoints.

### 👥 2. Dynamic User & Admin Management
* **Account Lifecycle Control:** Administrative controls to review pending users via explicit `User Approval / Rejection` endpoints.
* **Access Control Toggle:** Live state management to `Activate / Deactivate Users` instantly, cutting off server access for suspended accounts.
* **Protected First Admin Bootstrapping:** Hardened initialization logic for seed admins, preventing unauthorized admin privilege escalation.
* **Admin Management Suite:** Full administrative control panel routes for managing workspace admins, updating `Admin Roles`, and monitoring user states.

### 📋 3. Advanced Complaint Lifecycle Management
* **Complaint Logging:** Endpoints for authenticated users to `Create & Track Complaints` dynamically from inception to resolution.
* **Comprehensive Search & Discovery:** Built-in server-side indexing utilities for `Complaint Search / Filter` by string text, categories, dates, and live status.
* **Status Updates Control:** State transition routes enabling Admins to modify individual complaints (e.g., transitioning from *Pending* ➡️ *In Progress* ➡️ *Resolved/Rejected*).

### 📊 4. Analytical Profiles & Dashboard
* **Dynamic Profiles:** Protected `Profile Fetch & Update` routes for users to safely manage personal data.
* **Dashboard Aggregations & Statistics:** High-performance database aggregation pipelines to fetch dynamic count stats (e.g., total registered users, active complaints, resolved percentages) for the admin control panel.
* **Universal CORS Patch:** Deployed full cross-device flexibility (`origin: "*"`) allowing asynchronous API processing across both desktop monitors and mobile screen viewports.

---

## ⚙️ Local Setup Guide

Follow these steps to set up and run this backend application locally on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com
cd cms_backend
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Configure Local Environment Variables
Create a `.env` file in your root folder and define the system variables:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_production_string
JWT_SECRET=your_super_secure_jwt_token_secret_string
```

### 4. Boot up the Application
* **Development Mode (Auto-Reload via Nodemon):** `npm run dev`
* **Production Mode (Stable Server Instance):** `npm start`

