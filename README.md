# 🧊 CubeDesk — Smart Cube Timer

**CubeDesk** is a lightweight, full-stack Rubik’s Cube timer and statistics tracker built with **React**, **Node.js (Express)**, and **MySQL**.
It allows you to time your solves, handle inspections, apply penalties, and view averages — all while storing data persistently in a real database, rather than local storage.

---

## 🚀 Features

* ⏱️ **Accurate Timer** — Starts, stops, and resets via Spacebar
* 👀 **15-Second Inspection** — Auto-starts solve when inspection ends
* 💾 **Persistent Storage** — Solves are stored in MySQL via Express API
* ⚙️ **Cube Type Sessions** — Supports 2×2, 3×3, 4×4 cubes
* 🧮 **Stats Dashboard** — Displays mO5, aO5, ao12 and best times in a session
* 🧰 **Solve Management** — Mark solves as DNF, add a +2 penalty, or delete the solve
* 🧹 **Reset Option** — Clear all solves for a cube type

---

## 🏗️ Tech Stack
### **Frontend**

* React (Vite)
* Axios (for API calls)
* Tailwind CSS / basic CSS (optional styling)

### **Backend**

* Node.js + Express
* MySQL (with mysql2)
* dotenv + cors

---

## ⚙️ Setup Instructions

### 🧩 1. Clone the Repository

```bash
git clone https://github.com/SupradeepVaranasi67/cubedesk.git
cd cubedesk
```

### 🧱 2. Backend Setup

```bash
cd backend
npm install
```

#### Create `.env`

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=cubedesk
PORT=5000
```

#### Create Database

Open MySQL and run:

```sql
CREATE DATABASE cubedesk;
USE cubedesk;

CREATE TABLE solves (
  id INT AUTO_INCREMENT PRIMARY KEY,
  time FLOAT NOT NULL,
  cubeType VARCHAR(50),
  penalty VARCHAR(10)
);
```

#### Run Server

```bash
npm start
```

> Runs on `http://localhost:5000`

---

### 💻 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

> Runs on `http://localhost:3000`

---

## 🔄 API Endpoints

| Method   | Endpoint          | Description      |
| -------- | ----------------- | ---------------- |
| `GET`    | `/api/solves`     | Fetch all solves |
| `POST`   | `/api/solves`     | Add new solve    |
| `PUT`    | `/api/solves/:id` | Update penalty   |
| `DELETE` | `/api/solves/:id` | Delete solve     |

---

## 🧮 Sample Workflow

1. Select your cube type (2×2, 3×3, etc.)
2. Press **Space** to begin inspection (15 seconds)
3. Press **Space** again to start early or automatically start after the countdown
4. Press **Space** again to stop the timer and save the solve
5. View your solves in **Solve History**
6. Apply penalties or mark DNF as needed


---

## 🧠 Future Improvements

* Add authentication for user-based sessions
* Add all WCA events like 5x5, 6x6, 7x7, e.t.c
* Store average stats on the backend
* Include a draw scramble function
* Export solves as CSV
* Add voices for inspection
* Add various color themes
* Enable connections with Bluetooth cubes(GAN Cubes) and actual timers
* Deploy to cloud (Render / Vercel + Railway)

---

## 👤 Author

**Supradeep Varanasi**

---

Built for practice, learning, and speedcubing convenience.

---
