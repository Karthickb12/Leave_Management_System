<div align="center">
  <h1>🎓 EduFlow - Leave Management System</h1>
  <p>A centralized system for managing student OD, Leave, and Permission requests with a smart, multi-level approval workflow.</p>

  <!-- Add your badges here -->
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" />
  <img alt="Firebase" src="https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black" />
</div>

<br />

## 📸 Screenshots

<div align="center">
  <img width="49%" alt="Screenshot 1" src="https://github.com/user-attachments/assets/4aec4e49-17b0-4730-89f1-464ba99c8323" />
  <img width="49%" alt="Screenshot 2" src="https://github.com/user-attachments/assets/9d4dd751-a911-4cec-9eec-da7dfc87d9e9" />
  <img width="49%" alt="Screenshot 3" src="https://github.com/user-attachments/assets/e6b7a899-6e86-455a-89d4-ab9481c7babb" />
  <img width="49%" alt="Screenshot 4" src="https://github.com/user-attachments/assets/4977276b-a9a4-4e32-a76c-d93f05905142" />
  <img width="49%" alt="Screenshot 5" src="https://github.com/user-attachments/assets/efe776d5-a520-4245-8913-ef2f547691e5" />
  <img width="49%" alt="Screenshot 6" src="https://github.com/user-attachments/assets/619b0f43-5d6c-4021-9de3-708876a40e4c" />
  <img width="49%" alt="Screenshot 7" src="https://github.com/user-attachments/assets/ad44f119-7195-494c-a8c9-eec5bce9bb46" />
  <img width="49%" alt="Screenshot 8" src="https://github.com/user-attachments/assets/70d3b54a-4341-4ddc-a854-5f7b4296c31e" />
  <img width="49%" alt="Screenshot 9" src="https://github.com/user-attachments/assets/5df1c348-cc9f-4315-bc9f-c09972c8cb01" />
</div>

---

## ✨ Features
- **Role-Based Workflows**: Tailored experiences for Students, Advisors, HODs, and Principals.
- **Smart Routing Logic**:
  - Leave <= 2 days ➡️ Routed to Advisor
  - Leave > 5 days ➡️ Routed to Advisor ➡️ HOD ➡️ Principal
  - Emergency ➡️ Routed directly to Advisor
- **Real-time Tracking**: Live status updates for all submitted requests.
- **Modern UI/UX**: Fluid animations powered by Framer Motion and a responsive interface using Tailwind CSS.
- **Secure Architecture**: Data and authentication backed securely by Firebase.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion
- **Backend**: Python FastAPI
- **Database & Auth**: Firebase (Firestore & Authentication)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js & npm installed
- Python 3.8+ installed
- A Firebase Project (with Firestore & Authentication enabled)

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Activate Virtual Environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt
```

> **Important**: Place your Firebase Admin SDK JSON file in `backend/` and rename it to `serviceAccountKey.json` (or update your `.env` to point to it).

Start the FastAPI backend server:
```bash
uvicorn main:app --reload
```
*API runs at: `http://localhost:8000`*

### 2. Frontend Setup

```bash
cd frontend
npm install
```

> **Important**: Rename `.env.local.example` to `.env.local` and fill in your Firebase Client Configuration.

Start the React development server:
```bash
npm run dev
```
*App runs at: `http://localhost:5173`*

---

## 📂 Project Structure
```text
SCH_Project/
├── backend/                  # FastAPI Application
│   ├── app/                  # Routes, DB, Models, Security
│   ├── main.py               # API Entry point
│   ├── requirements.txt      # Python dependencies
│   └── serviceAccountKey.json # Firebase Admin SDK
├── frontend/                 # React (Vite) Application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Context API (Auth, Theme)
│   │   ├── pages/            # Application views (Dashboard, Login, etc.)
│   │   └── lib/              # Utility functions & API clients
│   ├── package.json          # Node dependencies
│   └── tailwind.config.js    # Tailwind theme configuration
└── README.md                 # Project documentation
```

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/Karthickb12">Karthickb12</a></p>
</div>
