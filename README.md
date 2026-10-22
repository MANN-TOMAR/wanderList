# Wanderlust 🌍✈️

Wanderlust is a full-stack web application designed for exploring and sharing vacation rentals and unique stays worldwide, inspired by Airbnb.

Built with **Node.js**, **Express.js**, **MongoDB Atlas**, and **EJS Mate**.

---

## 🌟 Key Features

- **Listings Management:** Full CRUD (Create, Read, Update, Delete) functionality for travel destinations and rental homes.
- **Reviews & Ratings:** Dynamic review system with interactive 1-to-5 star ratings and cascade deletion.
- **Authentication & Authorization:** Secure user sign-up and login with session persistence (`Passport.js` and `connect-mongo`).
- **Authorization Guards:** Role-based permissions ensuring only listing/review owners can edit or delete their content.
- **Schema Validation:** Strict client-side and server-side input validation using **Joi** schemas.
- **Cloud-Ready Deployment:** Production configuration for **Render** paired with **MongoDB Atlas**.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Node.js, Express.js (v5) |
| **Database** | MongoDB Atlas, Mongoose (v9) |
| **Session Store** | `connect-mongo` (v6) |
| **Authentication**| Passport.js (`passport-local`, `passport-local-mongoose`) |
| **Validation** | Joi |
| **Views / UI** | EJS, EJS-Mate, Bootstrap 5, FontAwesome |
| **Hosting** | Render (Web Service) |

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local Community edition or a MongoDB Atlas cluster)

### 2. Clone and Install

```bash
git clone https://github.com/MANN-TOMAR/wanderList.git
cd wanderList
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/wanderlust?retryWrites=true&w=majority
SECRET=your_super_secret_session_key
PORT=8000
```

### 4. Seed the Database
Populate the database with sample listings:

```bash
node init/index.js
```

### 5. Run the Application

```bash
# Start server
npm start

# Or in development with nodemon
npx nodemon app.js
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🌐 Deployment on Render

This project includes a `render.yaml` blueprint. To deploy:
1. Connect your GitHub repository to [Render](https://dashboard.render.com/).
2. Create a **Web Service** with:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add the following **Environment Variables**:
   - `ATLASDB_URL`: Your MongoDB Atlas connection URI
   - `SECRET`: A random secret key for sessions
   - `NODE_ENV`: `production`

---

## 📜 License
This project is open-source and available under the [ISC License](LICENSE).
