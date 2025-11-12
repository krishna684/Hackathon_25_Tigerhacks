<img width="2545" height="1297" alt="image" src="https://github.com/user-attachments/assets/9a3236ab-ed50-4837-b24e-0beb099bcb77" />


# 🌌 UKLAA — Live Meteor & NEO Tracker

### + Gemini Interstellar Query (AI Companion)

**UKLAA** is a next-generation **React + Three.js** web application that brings together **real-time space visualization** and **AI-driven exploration**.
It features an **interactive 3D globe** for tracking meteors, fireballs, and near-Earth objects (NEOs) — now enhanced by **Gemini Interstellar Query**, an intelligent AI system built using the **Google Gemini API**.
Together, they form a powerful platform for real-time discovery, analysis, and conversation about the cosmos.

---

## 🌐 Live Demo

👉 **Explore UKLAA now:** [https://prismatic-selkie-d3177f.netlify.app/](https://prismatic-selkie-d3177f.netlify.app/)

Experience the real-time 3D meteor tracking and AI-powered Gemini chatbot directly in your browser — optimized for both desktop and mobile.

---

## ✨ Core Features

* 🌍 **Interactive 3D Globe** — Real-time WebGL globe with Earth, Moon, starfield, and orbit controls
* 🌠 **Live Meteor Tracking** — Particle-based meteor visualization with atmospheric entry effects
* 🔴 **Real-Time Data** — Fetches live NEO and fireball data from NASA, AMS, and GMN APIs
* 🎛️ **Layer Controls** — Toggle meteors, NEOs, and GMN camera layers independently
* ⚙️ **Quality Settings** — Adjustable Level of Detail (low/medium/high particle density)
* ♿ **Accessibility** — ARIA support, keyboard shortcuts, and responsive layouts
* 🔐 **Auth0 Integration** — Secure authentication for protected routes and user dashboards
* 📦 **Caching & Offline Mode** — localStorage-based caching with TTL fallback
* 🚀 **Deployment Ready** — Optimized for Vercel and Netlify with CI/CD and E2E tests

---

## 🤖 Gemini Interstellar Query (AI Companion — Gemini Bot)

**Gemini Interstellar Query** (also called the **Gemini Bot**) is the AI companion integrated into *UKLAA*.
It showcases the **Google Gemini API** through two major modes — a **Multi-Agent System** and an **Interactive Chat Interface** — all wrapped in the same immersive space-themed environment.

### 🧩 Modes & Capabilities

#### **Mode 1: Multi-Agent System**

A coordinated 4-agent system that processes queries from interpretation to synthesis:

* 🧠 **Agent₁ – Interpreter (`gemini-2.5-flash`)**: Understands user intent and extracts meaning.
* 🧮 **Agent₂ – Refiner (`gemini-2.5-flash` JSON Mode)**: Derives keywords for media and context.
* 🛰️ **Agent₃ – Tool User (`gemini-2.5-flash-image` + Google Search)**: Fetches real data and generates visuals.
* 🪐 **Agent₄ – Aggregator (`gemini-2.5-flash`)**: Combines all outputs into a cohesive, illustrated summary.
* ⚡ **Error Handling:** Each agent’s card shows its status, logs, and “Retry” button.

#### **Mode 2: Chat Interface**

Engage in dynamic, real-time conversations powered by Gemini models:

* **Standard:** Conversational mode using `gemini-2.5-flash`.
* **Fast Response:** Lightning-fast streaming via `gemini-2.5-flash-lite`.
* **Grounded Search:** Real-time factual mode using Google Search.
* **Deep Thought:** Analytical reasoning for complex or research topics.

### 🌠 UI & Integration

* **Unified Design:** Shares UKLAA’s space visuals, glassmorphism, and animations.
* **Live Visualization:** Shows each agent’s task flow and outputs in real time.
* **Zero-Build React App:** Runs directly in-browser using native ES modules and TypeScript.

### ⚙️ Tech Stack

* **Frontend:** React, TypeScript, Tailwind CSS
* **AI Models:** `gemini-2.5-flash`, `gemini-2.5-flash-lite`, `gemini-2.5-flash-image`
* **APIs:** Google Gemini API, Google Search
* **Rendering:** Marked.js for AI responses

### 🧪 Local Setup

```bash
git clone https://github.com/krishna684/gemini_bot.git
cd gemini_bot
npm install
```

In `services/geminiService.ts`, replace:

```typescript
const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY_HERE" });
```

Run:

```bash
python -m http.server
```

Then open: [http://localhost:8000](http://localhost:8000)

### 🔗 Integration in UKLAA

* Route: `/gemini` or `/astro-ai`
* Authenticated and themed with the same global layout
* Future plans: AI-based NEO insights, object classification, and contextual voice search

---

## 🛠️ Tech Stack

* **Frontend:** React 19, Three.js, Vite
* **Authentication:** Auth0
* **APIs:** NASA NEO Feed, AMS Fireballs, GMN Observations, OpenCage Geocoding
* **Testing:** Jest, Cypress
* **Deployment:** Vercel / Netlify
* **Monitoring:** Sentry / LogRocket

---

## 🚀 Getting Started

### Prerequisites

* Node.js v16+
* npm or yarn
* Auth0 credentials (optional for local dev)
* API keys for NASA, OpenCage, and Gemini

### Installation

```bash
git clone https://github.com/SteveRogersBD/Space.git
cd Space
npm install
cp .env.example .env.local
```

Add environment variables:

```env
VITE_AUTH0_DOMAIN=your-domain.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.uklaa.org
VITE_NASA_API_KEY=DEMO_KEY
VITE_OPENCAGE_KEY=your-opencage-key
VITE_GEMINI_API_KEY=your-gemini-key
```

Run locally:

```bash
npm run dev
```

Open [http://localhost:3001/live-tracking](http://localhost:3001/live-tracking)

---

## 🧭 Keyboard Shortcuts

| Key | Action                 |
| --- | ---------------------- |
| `H` | Scroll to Hero section |
| `G` | Scroll to Globe        |
| `R` | Reset globe view       |
| `?` | Show keyboard help     |

---

## 🌐 API Endpoints

| Source         | Endpoint                                            | Description                          |
| -------------- | --------------------------------------------------- | ------------------------------------ |
| **NASA**       | `https://api.nasa.gov/neo/rest/v1/feed`             | Near-Earth Objects data              |
| **AMS**        | `https://fireballs.amsmeteors.org/json/`            | Fireball reports                     |
| **GMN**        | `https://globalmeteornetwork.org/observations.json` | Global Meteor Network data           |
| **OpenCage**   | `https://api.opencagedata.com/geocode/v1/json`      | Geocoding                            |
| **Gemini API** | `https://generativelanguage.googleapis.com/v1beta`  | AI-powered queries & media synthesis |

---

## 🎨 Design & Experience

* **Glassmorphism UI** with subtle neon cyan glow
* **Animated particle backgrounds** and orbit rings
* **Dark space aesthetic** optimized for readability
* **Responsive** for mobile, tablet, and desktop
* **Smooth animations** and camera transitions

---

## 📦 Deployment

### On Netlify

1. Build the project

   ```bash
   npm run build
   ```
2. Connect GitHub repo
3. Set **build command:** `npm run build`
   Set **publish directory:** `dist`
4. Add environment variables in dashboard

### On Vercel

```bash
npm i -g vercel
vercel
```

---

## 📄 License

MIT License — see `LICENSE` for details.

---

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a pull request

---

**Built with ❤️ by Krishna Rithwik Karra, Dhanya, Anirudh**
**UKLAA** — *Where Space Meets Intelligence.* 🪐

