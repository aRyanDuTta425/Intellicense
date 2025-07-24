 
# IntelliCense 🛡️


  
  
  


**IntelliCense** is an AI-powered tool designed to scan digital content for potential copyright risks and help organizations ensure compliance with digital rights and licensing regulations. The system leverages Retrieval-Augmented Generation (RAG) models to provide real-time legal suggestions and precedents.

## 🌟 Core Features

- 🧠 **AI-Powered Scanning**: Advanced content analysis for copyright infringement risks.
- 📜 **Legal Intelligence**: Fetches relevant legal precedents and suggests compliance actions.
- ⚡ **Real-Time Analysis**: Instant feedback on digital content compliance.
- 🔍 **Multi-Format Support**: Analyze text, images, videos, and documents.
- 📊 **Detailed Reports**: Comprehensive compliance reports with actionable insights.
- 🔐 **Secure Authentication**: JWT-based authentication system for secure access.
- 📱 **Responsive Design**: Works seamlessly across desktop and mobile devices.

## 🛠️ Tech Stack

**Frontend:**

  
    
  


**Backend:**

  
    
  


**AI & Machine Learning:**

    
    


**Authentication:**

    


## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/)
- A [Google Gemini API Key](https://ai.google.dev/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/aRyanDuTta425/Intellicense.git
    cd Intellicense
    ```

2.  **Install dependencies** (run from the root directory):
    ```bash
    # This will install dependencies for both frontend and backend
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory by copying the example:
    ```bash
    cp backend/.env.example backend/.env
    ```
    Now, fill in the `backend/.env` file with your details:
    ```env
    DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE"
    JWT_SECRET="your-super-secret-jwt-key"
    GEMINI_API_KEY="your-google-gemini-api-key"
    ```

4.  **Set up the database:**
    ```bash
    cd backend
    npx prisma migrate dev
    npx prisma generate
    cd ..
    ```

5.  **Start the application:**
    ```bash
    # This command starts both the frontend and backend servers concurrently
    npm run dev
    ```

## 📖 Usage

1.  **Access the Application**: Navigate to `http://localhost:3000`.
2.  **Register/Login**: Create an account or sign in with existing credentials.
3.  **Upload Content**: Use the interface to upload your digital content (documents, images, etc.).
4.  **Review Results**: Analyze the real-time copyright risk assessment and download detailed reports.
5.  **Take Action**: Follow the AI-generated compliance suggestions and access relevant legal precedents.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to get started.

1.  🍴 **Fork** the repository.
2.  🌱 **Create** a new feature branch (`git checkout -b feature/your-amazing-feature`).
3.  📝 **Commit** your changes (`git commit -m 'feat: Add some amazing feature'`).
4.  🚀 **Push** to the branch (`git push origin feature/your-amazing-feature`).
5.  📬 **Open** a Pull Request.

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.


  Made with ❤️ by the IntelliCense Team



  ⭐ Star us on GitHub |
  Report an Issue

 
