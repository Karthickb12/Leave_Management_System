# College Event Tracker System

A centralized system for managing student OD, Leave, and Permission requests with a multi-level approval workflow.

## Tech Stack
-   **Frontend**: React (Vite) + Tailwind CSS + Framer Motion
-   **Backend**: Python FastAPI
-   **Database/Auth**: Firebase (Firestore & Authentication)

## Prerequisites
-   Node.js & npm
-   Python 3.8+
-   Firebase Project (with Firestore & Auth enabled)

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Install deps
pip install -r requirements.txt
```
**Important**: Place your Firebase Admin SDK JSON file in `backend/` and rename it to `serviceAccountKey.json` (or update `.env`).

Run the server:
```bash
uvicorn main:app --reload
```
API runs at: `http://localhost:8000`

### 2. Frontend Setup
```bash
cd frontend
npm install
```
**Important**: Rename `.env.local.example` to `.env.local` and fill in your Firebase Client Config.

Run the app:
```bash
npm run dev
```
App runs at: `http://localhost:5173`

## Features
-   **Student**: Submit OD/Leave requests (Validation automatically calculates days).
-   **Faculty**: "Pending Approvals" page with Role Switcher (Simulate Advisor/HOD/Principal).
-   **Logic**:
    -   Leave <= 2 days -> Advisor
    -   Leave > 5 days -> Advisor -> HOD -> Principal
    -   Emergency -> Advisor Only
