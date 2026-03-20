# 🏟️ QubiStake Arena

A high-performance, dual-mode staking dApp built for the Qubic ecosystem. Featuring "Deep Atmospheric" UI and a custom reward engine with dynamic dilution and loyalty mechanics.

## 🚀 Core Features

### 1. Dual-Mode Execution
- **🧪 Mock Mode**: Local simulation for testing strategies without real assets.
- **⛓ Real Mode**: Direct integration with Qubic Testnet RPC for authentic staking.

### 2. The Arena Engine (Backend)
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

## 📦 Installation

1. **Clone & Install Dependencies**
   ```bash
   npm install