# ClinTrace - Clinical Decision Traceability System

A full-stack healthcare application for recording clinical decision reasoning with AI-assisted rationale generation.

## Features
- **Role-Based Access Control**: Receptionist, Doctor, Admin.
- **Patient Management**: Create and assign patients.
- **Clinical Decision Support**: Record symptoms, reasoning, and constraints.
- **AI Rationale Generation**: Converts raw notes into structured rationale (OpenAI).
- **Immutability & Auditing**: Decisions are locked upon approval with version control.

## Tech Stack
- **Frontend**: React (Vite), TypeScript, TailwindCSS, Axios
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose)
- **AI**: OpenAI API

## Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)
- OpenAI API Key

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Update `OPENAI_API_KEY` and `MONGO_URI` in `.env`.*

4. Start the server:
   ```bash
   npm run dev
   ```
   The server runs on `http://localhost:5000`.

### 2. Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The client runs on `http://localhost:5173`.

## Usage Flow
1. **Register** a user (e.g., Doctor) at `/register` (not in UI, use Postman or implement UI). 
   *Note: For demo, you can use the Login page if you seed users or use a tool to post to `/api/auth/register`.*
2. **Login** as a Receptionist to add patients.
3. **Login** as a Doctor to view patients and create decisions.
4. **Create Decision**: Enter raw notes.
5. **Generate Rationale**: Use AI to structure the notes.
6. **Approve**: Lock the decision.

## Security Notes
- AI is strictly prohibited from diagnosing.
- All decisions require human approval.
- Passwords are hashed using bcrypt.
