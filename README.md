# 🤫 Anonymous Confession Wall

A full-stack MERN web application where users can share thoughts, secrets, and personal confessions — completely anonymously.

Designed with a modern **glassmorphism UI**, the app ensures privacy on the public feed while securely managing user ownership behind the scenes.

---

## 🚀 Features

### 🔐 Secure Authentication

* JWT-based login & registration
* Passwords hashed using bcrypt
* Auto logout on session end (tab close)

### 🧾 Anonymous Confession Feed

* Share posts without revealing identity
* Categories: Love ❤️, Funny 😂, Study 📚, Vent 😤, Secret 🤐

### 👍 Smart Reactions System

* WhatsApp-style reactions (👍 ❤️ 😂)
* Only one reaction per user per post
* Real-time updates when reactions change

### ✏️ Post Control via Secret Code

* Edit or delete your confessions anytime
* Protected with a unique Secret Code
* No code = no changes

### 🎨 Modern UI/UX

* Glassmorphism design system
* Animated gradient backgrounds
* Fully responsive (mobile-friendly)
* Smooth animations using Framer Motion

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Framer Motion
* Lucide React
* Custom CSS (Glassmorphism UI)

### Backend

* Node.js & Express
* MongoDB & Mongoose
* JSON Web Tokens (JWT)
* bcryptjs

---

## 📁 Project Structure

```
confession-wall-mern/
│
├── client/        # React frontend
│   ├── src/
│   ├── public/
│   └── ...
│
├── server/        # Express backend
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── ...
│
└── README.md
```

---

## ⚙️ Local Setup Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/diksha-tripathi-lpu/confession-wall-mern.git
cd confession-wall-mern
```

---

### 2️⃣ Backend Setup

Make sure MongoDB is running locally or use MongoDB Atlas.

Create a `.env` file inside `/server`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
cd server
npm install
npm start
```

Expected output:

```
MongoDB Connected
Server running on port 5000
```

---

### 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Visit:

```
http://localhost:5173
```

---

## 🌐 Deployment Guide

### 🔹 Frontend (Vercel)

1. Push your project to GitHub
2. Import project in Vercel
3. Set environment variable:

```
VITE_API_URL=https://your-backend-url
```

4. Deploy

---

### 🔹 Backend (Render / Railway)

* Connect your GitHub repository
* Set root directory → `server`

**Build command:**

```bash
npm install
```

**Start command:**

```bash
npm start
```

Add environment variables:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
```

---

### 🔹 Database (MongoDB Atlas)

* Create a free cluster
* Get connection string
* Use it in backend `.env`

---

## 🔗 Live Demo

Frontend: Coming Soon 🚀
Backend: Coming Soon 🚀

---

## 📌 Future Improvements

* 🔔 Notifications system
* 🧠 AI-based confession categorization
* 📊 Trending posts section
* 🚫 Report/Moderation system

---

## 👩‍💻 Author

**Diksha Tripathi**
🎓 B.Tech CSE (2027)
🔗 GitHub: https://github.com/diksha-tripathi-lpu
🔗 LinkedIn: https://www.linkedin.com/in/diksha-tripathi-0024a1230/

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
