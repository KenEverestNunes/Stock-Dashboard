Real-Time Crypto Market Dashboard
A high-performance, full-stack monitoring application that provides live Bitcoin price updates. This project demonstrates a scalable "Backend-as-Proxy" architecture to bridge frontend clients with external WebSocket streams efficiently.

🚀 Key Features
Live Data Streaming: Utilizes WebSockets to ingest real-time tick data from the Binance API via a FastAPI backend.

Optimized State Management: Implements Zustand for lightweight, global state management to handle high-frequency UI updates without performance degradation.

Responsive Glassmorphism UI: A modern, frosted-glass design built with Tailwind CSS, featuring layout-stable tabular numeric fonts for price tickers.

Decoupled Architecture: Uses a Python backend to transform and filter raw API data, reducing client-side overhead and increasing security.

🛠️ Tech Stack
Frontend: React (Vite), Zustand, Tailwind CSS.

Backend: FastAPI, WebSockets (Python).

Data Source: Binance US Public Market Streams.

📦 Project Structure
Plaintext
├── backend/
│   └── main.py           # FastAPI server & WebSocket proxy
├── src/
│   ├── components/
│   │   └── Dashboard.jsx # Main UI component
│   ├── store/
│   │   └── stockStore.js # Zustand state management
│   ├── App.jsx           # Root component
│   └── main.jsx          # Entry point
└── README.md
⚙️ Installation & Setup
1. Prerequisites
Node.js (v18+)

Python 3.10+

2. Backend Setup
Bash
cd backend
pip install fastapi uvicorn websockets
uvicorn main:app --reload
3. Frontend Setup
Bash
# From the root directory
npm install
npm run dev