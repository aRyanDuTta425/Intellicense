IntelliCense 🛡️
<p align="center">
<a href="https://github.com/aRyanDuTta425/Intellicense/stargazers"><img src="https://img.shields.io/github/stars/aRyanDuTta425/Intellicense?style=for-the-badge&logo=github&color=FFC107" alt="GitHub Stars"/></a>
<a href="https://github.com/aRyanDuTta425/Intellicense/blob/main/LICENSE"><img src="https://img.shields.io/github/license/aRyanDuTta425/Intellicense?style=for-the-badge&logo=opensourceinitiative&color=4CAF50" alt="License"/></a>
<a href="https://github.com/aRyanDuTta425/Intellicense/issues"><img src="https://img.shields.io/github/issues/aRyanDuTta425/Intellicense?style=for-the-badge&logo=github&color=F44336" alt="Issues"/></a>
</p>

IntelliCense is an AI-powered tool designed to scan digital content for potential copyright risks and help organizations ensure compliance with digital rights and licensing regulations. The system leverages Retrieval-Augmented Generation (RAG) models to provide real-time legal suggestions and precedents.

🌟 Core Features
🧠 AI-Powered Scanning: Advanced content analysis for copyright infringement risks.

📜 Legal Intelligence: Fetches relevant legal precedents and suggests compliance actions.

⚡ Real-Time Analysis: Instant feedback on digital content compliance.

🔍 Multi-Format Support: Analyze text, images, videos, and documents.

📊 Detailed Reports: Comprehensive compliance reports with actionable insights.

🔐 Secure Authentication: JWT-based authentication system for secure access.

📱 Responsive Design: Works seamlessly across desktop and mobile devices.

🛠️ Tech Stack
Frontend:

<p>
<a href="https://skillicons.dev">
<img src="https://skillicons.dev/icons?i=react,ts,tailwind,html,css,zod" />
</a>
</p>

Backend:

<p>
<a href="https://skillicons.dev">
<img src="https://skillicons.dev/icons?i=nodejs,express,prisma,postgresql" />
</a>
</p>

AI & Machine Learning:

<p>
<img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini"/>
<img src="https://img.shields.io/badge/RAG%20Models-FF6B6B?style=for-the-badge&logo=robotframework&logoColor=white" alt="RAG Models"/>
</p>

Authentication:

<p>
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
</p>

🚀 Quick Start
📋 Prerequisites
Node.js (v18 or higher recommended)

PostgreSQL

A Google Gemini API Key

⚙️ Installation
Clone the repository:

git clone https://github.com/aRyanDuTta425/Intellicense.git
cd Intellicense

Install dependencies (run from the root directory):

# This will install dependencies for both frontend and backend
npm install

🔑 Set up environment variables:
Create a .env file in the backend directory by copying the example:

cp backend/.env.example backend/.env

Now, fill in the backend/.env file with your details:

DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-super-secret-jwt-key"
GEMINI_API_KEY="your-google-gemini-api-key"

🗄️ Set up the database:

cd backend
npx prisma migrate dev
npx prisma generate
cd ..

▶️ Start the application:

# This command starts both the frontend and backend servers concurrently
npm run dev

📖 Usage
🌐 Access the Application: Navigate to http://localhost:3000.

👤 Register/Login: Create an account or sign in with existing credentials.

📤 Upload Content: Use the interface to upload your digital content (documents, images, etc.).

📈 Review Results: Analyze the real-time copyright risk assessment and download detailed reports.

✅ Take Action: Follow the AI-generated compliance suggestions and access relevant legal precedents.

🤝 Contributing
We welcome contributions! Please see our Contributing Guidelines for details on how to get started.

🍴 Fork the repository.

🌱 Create a new feature branch (git checkout -b feature/your-amazing-feature).

📝 Commit your changes (git commit -m 'feat: Add some amazing feature').

🚀 Push to the branch (git push origin feature/your-amazing-feature).

📬 Open a Pull Request.

📜 License
This project is licensed under the MIT License. See the LICENSE file for details.

<br>
<p align="center">
<strong>Made with ❤️ by the IntelliCense Team</strong>
</p>
<p align="center">
<a href="https://github.com/aRyanDuTta425/Intellicense/stargazers">⭐ Star us on GitHub</a> |
<a href="https://github.com/aRyanDuTta425/Intellicense/issues">Report an Issue</a>
</p>
