# 🚀 MicroStore Generator

[**Live Demo**](https://micro-store-generator.vercel.app/)

**MicroStore Generator** is a sleek, production-ready web application designed for micro-business owners to create and share their online store pages instantly. Built with a premium **Dark Theme** and powered by **React** and **Firebase**.

## ✨ Features

- **⚡ Instant Store Creation**: Generate a professional store page by simply filling a form.
- **📱 Mobile-First Design**: Optimized for small screens to ensure customers can browse easily.
- **💎 Premium Dark UI**: Modern aesthetics with Glassmorphism and electric indigo accents.
- **📞 One-Tap Connectivity**:
  - **Call Now**: Direct dialer integration.
  - **WhatsApp Order**: Pre-filled message setup to receive orders instantly.
  - **UPI Payments**: Deep-link integration for seamless payments via Google Pay, PhonePe, or Paytm.
- **🔥 Serverless Backend**: Powered by Firebase Firestore for real-time data handling.

## 🛠️ Tech Stack

- **Frontend**: [React.js](https://reactjs.org/) (Vite)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Styling**: Vanilla CSS (Modern CSS3 with Variable-based Theming)
- **Routing**: [React Router v6](https://reactrouter.com/)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/dilipnalage1063/MicroStore-Generator.git
cd MicroStore-Generator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Setup
1. Create a project on [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** in Test Mode.
3. Create a **Web App** and copy your `firebaseConfig`.
4. Update `src/firebase.js` with your credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  // ... rest of the config
};
```

### 4. Run Locally
```bash
npm run dev
```

## 📦 Deployment (Vercel)

This project is optimized for Vercel. 
1. Push your code to GitHub.
2. Link your repository to **Vercel**.
3. It will auto-detect Vite and deploy instantly!

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ for Micro-Entrepreneurs.
