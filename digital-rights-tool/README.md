# Digital Rights and Content Licensing Compliance Tool

An AI-powered tool to help users verify content licensing, get summaries of licensing terms, and ask questions about digital rights.

## Features

- **User Authentication**: Secure login and registration system
- **Content Upload**: Support for images, articles, and videos
- **AI Licensing Analysis**: Automated analysis of content for licensing information
- **Risk Assessment**: Evaluation of licensing compliance risks
- **Legal Q&A**: AI-powered answers to legal questions about digital rights

## Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- React Hook Form
- Zod for validation
- Axios for API requests

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT for authentication

## Project Structure

```
digital-rights-tool/
├── frontend/           # React + TypeScript frontend
└── backend/            # Node.js + Express API
```

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd digital-rights-tool/backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/digital_rights_tool"
   JWT_SECRET="your-jwt-secret"
   PORT=5000
   ```

4. Run Prisma migrations:

   ```
   npx prisma migrate dev
   ```

5. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd digital-rights-tool/frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

### Content Upload

- `POST /api/upload` - Upload new content
- `GET /api/upload` - Get user's uploads
- `GET /api/upload/:id` - Get specific upload

### Analysis

- `POST /api/analysis/:uploadId` - Create new analysis
- `GET /api/analysis/:uploadId` - Get analysis for upload

### Legal Questions

- `POST /api/request` - Submit a legal question
- `GET /api/request` - Get user's questions and answers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Deployment Instructions

### Backend Deployment (Render)

1. Create a Render account at [render.com](https://render.com/)
2. Connect your GitHub repository
3. Create a new Web Service
4. Configure the service:
   - Name: `digital-rights-tool-backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `JWT_SECRET`: A secure secret key for JWT

### Frontend Deployment (Vercel)

1. Create a Vercel account at [vercel.com](https://vercel.com/)
2. Connect your GitHub repository
3. Create a new project
4. Configure the project:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Add environment variables:
     - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://digital-rights-tool-backend.onrender.com`)

## Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT authentication

### Frontend

- `VITE_API_URL`: URL of the backend API
