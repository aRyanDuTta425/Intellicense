 
**IntelliCense** is an AI-powered tool designed to scan digital content for potential copyright risks and help organizations ensure compliance with digital rights and licensing regulations. The system leverages Retrieval-Augmented Generation (RAG) models to provide real-time legal suggestions and precedents.

## 🌟 Features

- 🧠 **AI-Powered Scanning**: Advanced content analysis for copyright infringement risks
- 📜 **Legal Intelligence**: Fetches relevant legal precedents and suggests compliance actions
- ⚡ **Real-Time Analysis**: Instant feedback on digital content compliance
- 🔍 **Multi-Format Support**: Analyze text, images, videos, and documents
- 📊 **Detailed Reports**: Comprehensive compliance reports with actionable insights
- ⚙️ **Modern Frontend**: Built with **React** and **TypeScript** for optimal performance
- 💾 **Robust Backend**: Powered by **Prisma** and **PostgreSQL** for reliable data management
- 🔐 **Secure Authentication**: JWT-based authentication system
- 📱 **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flats://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zshields.io/badge/PostgreSQL-316192?style=flat&  |
| **AI/ML** | ![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat&logo=googlege/Node.js-43853D?style=flat&logoio/badge/PostgreSQL-316192?style=flat&logo= ![MySQL](https://img.shields.io/badge/MySQL-00000F?style=flat&logo the repository**
   ```bash
   git clone https://github.com/aRyanDuTta425/Intellicense.git
   cd Intellicense
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Configure your environment variables
   DATABASE_URL="postgresql://username:password@localhost:5432/intellicense"
   JWT_SECRET="your-jwt-secret"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Database Setup**
   ```bash
   # Run database migrations
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   ```

5. **Start the application**
   ```bash
   # Start backend (Terminal 1)
   cd backend
   npm run dev
   
   # Start frontend (Terminal 2)
   cd frontend
   npm start
   ```

## 📖 Usage

### Getting Started

1. **Access the Application**
   - Navigate to `http://localhost:3000`
   - Create an account or sign in

2. **Upload Content**
   - Click the **"Scan Content"** button
   - Upload your digital content (text, images, videos, documents)
   - Select content type and scanning preferences

3. **Review Results**
   - View real-time scanning progress
   - Analyze copyright risk assessment
   - Download detailed compliance reports

4. **Take Action**
   - Follow AI-generated compliance suggestions
   - Access relevant legal precedents
   - Implement recommended changes

### Supported File Types

- **📄 Documents**: PDF, DOCX, TXT, MD
- **🖼️ Images**: JPG, PNG, GIF, SVG, WEBP
- **🎥 Videos**: MP4, AVI, MOV, WMV
- **🎵 Audio**: MP3, WAV, AAC, FLAC

## 🔧 Configuration

### Environment Variables

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/intellicense"

# Authentication
JWT_SECRET="your-secure-jwt-secret"
JWT_EXPIRES_IN="24h"

# AI Configuration
GEMINI_API_KEY="your-gemini-api-key"
RAG_MODEL_ENDPOINT="your-rag-endpoint"

# Application Settings
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/auth/register` | POST | User registration |
| `/api/scan/upload` | POST | Upload content for scanning |
| `/api/scan/results/:id` | GET | Retrieve scan results |
| `/api/legal/precedents` | GET | Fetch legal precedents |

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd backend
npm test

# Run integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage
```

## 📊 Performance & Monitoring

- **Response Time**: 
  Made with ❤️ by the IntelliCense Team
  Protecting your digital content, one scan at a time.



  ⭐ Star us on GitHub |
  🐦 Follow on Twitter |
  💼 Connect on LinkedIn


The main changes I made:
1. Updated the clone URL to: `https://github.com/aRyanDuTta425/Intellicense.git`
2. Updated the issue tracker link to: `https://github.com/aRyanDuTta425/Intellicense/issues`
3. Updated the stargazers link to: `https://github.com/aRyanDuTta425/Intellicense/stargazers`

 
