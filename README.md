# AI Interview Platform

This is an AI-powered mock interview platform designed to help candidates prepare for AI/ML roles by providing a realistic, multi-faceted interview experience. It includes resume analysis with ATS scoring, a text-based interview chatbot, and a live video interview simulator.

## Features

- **Resume Analyzer & ATS Scorer**: Upload your resume to get an ATS compatibility score and detailed feedback.
- **AI Interview Chatbot**: Practice text-based interviews with an AI interviewer and receive instant feedback.
- **Live Video Interview Session**: Experience realistic video interviews with AI analysis of speech, body language, and responses.
- **User Authentication**: Secure login and signup pages.
- **Dashboard**: Central hub to access all features and track progress.
- **Interview History**: Review past interviews and resume analyses.

## Technology Stack

- **Frontend/Backend**: Next.js (React, API Routes)
- **Database**: PostgreSQL (managed with Prisma ORM)
- **Styling**: Tailwind CSS
- **Authentication**: JWT, bcryptjs
- **File Parsing**: `pdf-parse` for PDFs, `mammoth` for DOCX
- **AI Services (Mocked)**: OpenAI GPT-4 API (for LLM), OpenAI Whisper API (for STT), ElevenLabs API (for TTS), MediaPipe (for Facial & Visual Analysis) - *Note: These are currently mocked and require actual API integration for full functionality.*

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL database

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ai-interview-platform
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory of the project and add the following:
    ```env
    # Database
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public"

    # NextAuth.js (replace with strong, random keys)
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-nextauth-secret-key"

    # OpenAI API (replace with your actual API key)
    OPENAI_API_KEY="your-openai-api-key-here"

    # File Upload
    MAX_FILE_SIZE=10485760  # 10MB in bytes

    # JWT (replace with a strong, random key)
    JWT_SECRET="your-jwt-secret-key"
    ```
    **Important**: Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE_NAME` with your PostgreSQL database credentials. For `NEXTAUTH_SECRET` and `JWT_SECRET`, generate strong, random strings.

4.  **Set up the database:**
    This project uses Prisma for database management. You need to apply the migrations to your PostgreSQL database.

    First, ensure your PostgreSQL database is running and accessible via the `DATABASE_URL` provided in your `.env` file.

    Then, run the migrations:
    ```bash
    npx prisma migrate deploy
    ```
    If you are developing locally and need to reset your database or apply new migrations during development, you can use:
    ```bash
    npx prisma migrate dev --name <migration-name>
    ```

5.  **Generate Prisma Client:**
    ```bash
    npx prisma generate
    ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This application is designed for deployment on [Vercel](https://vercel.com/).

1.  **Connect your Git repository** to Vercel.
2.  **Configure Environment Variables**: Add all variables from your `.env` file (especially `DATABASE_URL`, `NEXTAUTH_SECRET`, `OPENAI_API_KEY`, `JWT_SECRET`) to your Vercel project settings.
3.  **Database Migrations on Vercel**: Vercel automatically runs `prisma migrate deploy` during the build process if a `postinstall` script is configured in `package.json` or if Prisma is detected. Ensure your `DATABASE_URL` is correctly set in Vercel environment variables.

    To ensure migrations run on deployment, you can add a `postinstall` script to your `package.json`:
    ```json
    {
      "name": "ai-interview-platform",
      "version": "0.1.0",
      "private": true,
      "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint",
        "postinstall": "prisma generate && prisma migrate deploy"
      },
      "dependencies": {
        // ... your dependencies
      }
    }
    ```

## API Endpoints

-   `POST /api/auth/signup`: Register a new user.
-   `POST /api/auth/login`: Authenticate user and receive JWT.
-   `GET /api/auth/me`: Get current user details (requires JWT).
-   `POST /api/resume/analyze`: Upload resume for ATS scoring and AI feedback (requires JWT).
-   `POST /api/interview/start`: Start a new text-based interview session (requires JWT).
-   `POST /api/interview/answer`: Submit an answer for a text-based interview question and get feedback (requires JWT).

## Project Structure

```
/
├── public/
├── src/
│   ├── app/                  # Next.js App Router pages and API routes
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication API (login, signup, me)
│   │   │   ├── interview/    # Interview API (start, answer)
│   │   │   └── resume/       # Resume analysis API
│   │   ├── dashboard/        # Dashboard page
│   │   ├── history/          # Interview history page
│   │   ├── login/            # Login page
│   │   ├── resume-analyzer/  # Resume analyzer page
│   │   ├── signup/           # Signup page
│   │   ├── text-interview/   # Text interview page
│   │   ├── video-interview/  # Video interview page
│   │   ├── globals.css       # Global styles
│   │   └── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── contexts/             # React Contexts (e.g., AuthContext)
│   └── lib/                  # Utility functions (e.g., Prisma client, auth helpers)
├── prisma/                   # Prisma schema and migrations
│   └── schema.prisma
├── .env                      # Environment variables
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```
```
```
