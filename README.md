  <div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
# 🏟️ QubiStake

A high-performance, dual-mode staking dApp built for the Qubic ecosystem. Featuring "Deep Atmospheric" UI and a custom reward engine with dynamic dilution and loyalty mechanics.

## 🚀 Core Features

### 1. Dual-Mode Execution
- **🧪 Mock Mode**: Local simulation for testing strategies without real assets.
- **⛓ Real Mode**: Direct integration with Qubic Testnet RPC for authentic staking.

### 2. The QubiStake Engine (Backend)
- **Loyalty Multipliers**: Rewards scale based on duration ($1.0\times$ base, $1.5\times$ @ 2m, $2.0\times$ @ 5m).
- **Whale Boss Goal**: Global stake goal (5000 units) triggers **Overdrive Mode** (2x rewards for all).
- **Inverse Scaling**: Reward rates decrease by 0.1% for every 100 total units staked to simulate pool dilution.
- **Panic Button**: Emergency exit mechanism with a 5% "Socialized Exit Tax".

### 3. Dynamic Ranks
- **Qubic Recruit**: < 100 QUBIC
- **Node Guardian**: 100–500 QUBIC
- **Network Overlord**: 500+ QUBIC

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts, Lucide-React.
- **Backend**: Node.js, Express, Dotenv, CORS.
- **Aesthetic**: Glassmorphism, Backdrop-blur-xl, #05070A Deep Dark Theme.

## Run Locally

**Prerequisites:**  Node.js

## 📦 Installation

1. **Clone & Install Dependencies**
   ```bash
     `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/508f7359-13ed-4632-920a-0262aba42951



