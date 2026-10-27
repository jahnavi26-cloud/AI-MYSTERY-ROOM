# AI Mystery Room

AI Mystery Room lets a player describe a fictional scenario, investigate an AI-generated case, and submit a suspect as the culprit. The backend calls Gemini, validates and stores the case in MongoDB, and keeps the solution private until the player answers.

## Setup

1. Install Node.js 20 or newer and make sure MongoDB is running.
2. Keep the root `.env` for server settings. Copy `.env.example` to `.env` if you need a template, then set `MONGODB_URI` and `GEMINI_API_KEY`.
3. The frontend does not need its own `.env` for local development. It defaults to `http://localhost:3001/api`. If you want to change that address, copy `client/.env.example` to `client/.env` and set `VITE_API_BASE_URL`. Never put secrets in a client env file.
4. Run `npm install`.
5. Run `npm run dev` from the project root.
6. Open `http://localhost:5173`.

The server uses `GEMINI_MODEL` (defaults to `gemini-3.8-flash`) and listens on port `3001`. The health endpoint is `http://localhost:3001/api/health`.

