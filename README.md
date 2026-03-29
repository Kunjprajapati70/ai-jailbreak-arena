🔓 AI Jailbreak Arena

«🚀 A cyberpunk, real-time AI hacking simulation game where teams compete to jailbreak a secured AI system using logic, creativity, and prompt engineering.»

Built for hackathons, live events, and competitive environments with a projector-ready leaderboard.

---

🌐 Live Demo

👉 https://ai-jailbreak-arena.onrender.com

📦 GitHub Repository

👉 https://github.com/vijayprajapati9/ai-jailbreak-arena

---

🧠 Project Overview

AI Jailbreak Arena is inspired by real-world AI red-teaming, where systems are tested against adversarial prompts.

Players act as attackers trying to:

- Bypass AI restrictions

- Extract hidden secrets

- Outsmart defensive AI behavior

The system simulates a high-security AI environment with limited attempts and dynamic responses.

---

🎮 Gameplay Flow

Login → Interact with AI → Analyze Behavior → Exploit Weakness → WIN 🏆

🎯 Game Mechanics

- Limited attempts per team

- AI resists basic tricks

- Logical + creative thinking required

- Score based on attempts + time

- Live leaderboard ranking

---

⚡ Key Features

- 🤖 AI Chat Interface — Interact with AI and attempt jailbreak

- 🏆 Live Leaderboard — Real-time ranking (projector-friendly)

- 🔐 Admin Panel — Manage teams and control the game

- 💬 Cyberpunk Chat UI — WhatsApp-style neon interface

- 📡 MongoDB Backend — Persistent data storage

- 🌐 Deploy Ready — Works on Render

---

🛠 Tech Stack

Layer| Technology

Backend| Node.js + Express.js

Database| MongoDB Atlas

AI API| External API (Groq / LLaMA)

Frontend| HTML, CSS, JavaScript

Hosting| Render

---

📂 Project Structure

ai-jailbreak-arena/

├── controllers/        # Business logic

├── routes/             # API endpoints

├── models/             # MongoDB schemas

├── middleware/         # Auth & utilities

├── config/

│   └── db.js           # Database connection

├── public/             # Frontend files

│   ├── index.html

│   ├── leaderboard.html

│   ├── admin.html

│   ├── script.js

│   ├── leaderboard.js

│   ├── admin.js

│   ├── style.css

│   ├── terminal.css

│   └── admin-style.css

├── server.js           # Entry point

├── .env

└── package.json

---

⚙️ Installation & Setup

1️⃣ Clone Repository

git clone https://github.com/vijayprajapati9/ai-jailbreak-arena.git

cd ai-jailbreak-arena

---

2️⃣ Install Dependencies

npm install

---

3️⃣ Environment Variables

Create ".env" file:

PORT=3000

MONGO_URI=your_mongodb_connection_string

AI_API_KEY=your_ai_api_key

ADMIN_SECRET=your_admin_password

---

4️⃣ Run Server

npm start

---

5️⃣ Access Application

- 🎮 Game → http://localhost:3000

- 🏆 Leaderboard → http://localhost:3000/leaderboard

- 🔐 Admin Panel → http://localhost:3000/admin

---

🌍 Deployment (Render)

1. Connect GitHub repo to Render

2. Set Start Command → "node server.js"

3. Add environment variables

4. Deploy 🚀

---

🏆 Win Condition

Break AI Security → Reveal Secret → Rank #1

---

🔐 Admin Panel

Route: "/admin"

Features:

- Create teams

- Manage participants

- Monitor game activity

---

⚠️ Important Notes

- MongoDB ensures no data loss

- Always use ".env" for secrets

- Do not expose API keys

- Keep server active during live events

---

🔮 Future Enhancements

- 🔄 Real-time leaderboard (WebSockets)

- 🎮 Difficulty modes (Easy / Medium / Hard)

- 🧠 AI personality system

- 🎨 Advanced animations & glitch effects

- 📊 Analytics dashboard

---

👨‍💻 Author

Vijay 🚀

---

⭐ Support

If you like this project, give it a ⭐ on GitHub!

---

📄 License

MIT License — Built for hackathons & learning.
