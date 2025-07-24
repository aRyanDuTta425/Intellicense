Got it 😤 — let's **fix that** and give you the full **README.md with all the 🔥 icons included**, ready to be copy-pasted **as-is** into your project!

---

````markdown
# 🛡️ IntelliCense

![License](https://img.shields.io/github/license/aRyanDuTta425/Intellicense?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)
![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB.svg?style=flat-square&logo=react)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)

**IntelliCense** is an AI-powered tool designed to scan digital content for potential copyright risks and help organizations ensure compliance with digital rights and licensing regulations. The system leverages Retrieval-Augmented Generation (RAG) models to provide real-time legal suggestions and precedents.

---

## 🌟 Core Features

- 🧠 **AI-Powered Scanning**: Detects copyright infringement risks in real time.
- ⚖️ **Legal Intelligence**: Fetches legal precedents and recommends compliance actions.
- ⚡ **Real-Time Feedback**: Instant compliance results based on uploaded content.
- 📂 **Multi-Format Upload**: Supports text, image, and video formats.
- 📊 **Detailed Reports**: Downloadable compliance & legal recommendation reports.
- 🔐 **Secure Authentication**: Uses JWT for safe and scalable login.
- 📱 **Responsive UI**: Built with Tailwind & React for all screen sizes.

---

## 🛠️ Tech Stack

### 🎨 Frontend
[![React](https://skillicons.dev/icons?i=react,ts,tailwind,zod)](https://skillicons.dev)

### 🔧 Backend
[![Node.js](https://skillicons.dev/icons?i=nodejs,express,prisma,postgres)](https://skillicons.dev)

### 🤖 AI & ML
[![Google](https://img.shields.io/badge/Gemini%20API-Google-blue?logo=google&style=flat-square)](https://ai.google.dev/)
![RAG](https://img.shields.io/badge/RAG-Retrieval%20Augmented%20Generation-orange?style=flat-square)

### 🔐 Authentication
[![JWT](https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens&style=flat-square)](https://jwt.io)

---

## 🚀 Quick Start

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)
- [Google Gemini API Key](https://ai.google.dev/)

### 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/aRyanDuTta425/Intellicense.git
cd Intellicense
````

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp backend/.env.example backend/.env
```

Update `backend/.env`:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-jwt-secret"
GEMINI_API_KEY="your-gemini-api-key"
```

4. **Migrate database**

```bash
cd backend
npx prisma migrate dev
npx prisma generate
cd ..
```

5. **Start the app**

```bash
npm run dev
```

---

## 📖 Usage

1. Visit `http://localhost:3000`
2. Log in or register
3. Upload content (text/image/video)
4. Review AI-generated compliance suggestions
5. Download legal reports for record-keeping

---

## 🤝 Contributing

We love your input! Here's how to contribute:

1. 🍴 Fork the repo
2. 🌱 Create a feature branch

```bash
git checkout -b feat/amazing-feature
```

3. 🛠️ Make your changes & commit

```bash
git commit -m "feat: amazing feature"
```

4. 🚀 Push to GitHub

```bash
git push origin feat/amazing-feature
```

5. 📬 Open a Pull Request

For more info, see [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📜 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by the **IntelliCense Team**
⭐ [Star us on GitHub](https://github.com/aRyanDuTta425/Intellicense) • 🐛 [Report an Issue](https://github.com/aRyanDuTta425/Intellicense/issues)

```

 
