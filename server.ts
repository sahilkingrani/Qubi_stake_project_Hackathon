import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("qubistake.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    address TEXT PRIMARY KEY,
    balance REAL DEFAULT 1000.0,
    staked_amount REAL DEFAULT 0.0,
    session_start_time INTEGER,
    last_reward_calc_time INTEGER
  );

  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT,
    type TEXT,
    amount REAL,
    timestamp INTEGER,
    status TEXT DEFAULT 'Completed'
  );
`);

const app = express();
app.use(express.json());

const REWARD_PER_TICK = 0.02; // per second

function calculateRewards(user: any) {
  if (!user.session_start_time || user.staked_amount <= 0) return 0;
  
  const now = Date.now();
  const lastCalc = user.last_reward_calc_time || user.session_start_time;
  const secondsElapsed = Math.floor((now - lastCalc) / 1000);
  
  if (secondsElapsed <= 0) return 0;

  const totalElapsed = Math.floor((now - user.session_start_time) / 1000);
  let multiplier = 1.0;
  if (totalElapsed >= 300) multiplier = 2.0; // 5 mins
  else if (totalElapsed >= 120) multiplier = 1.5; // 2 mins

  // Reward is proportional to staked amount? 
  // The prompt says "0.02 units per tick". Usually this means a flat rate or %?
  // "0.02 units per tick" sounds like a flat rate regardless of stake size, 
  // but usually staking rewards are proportional. 
  // Let's stick to the prompt: 0.02 units per tick (flat) * multiplier.
  return secondsElapsed * REWARD_PER_TICK * multiplier;
}

function getUser(address: string) {
  let user = db.prepare("SELECT * FROM users WHERE address = ?").get(address) as any;
  if (user) {
    const rewards = calculateRewards(user);
    if (rewards > 0) {
      db.prepare("UPDATE users SET balance = balance + ?, last_reward_calc_time = ? WHERE address = ?")
        .run(rewards, Date.now(), address);
      user = db.prepare("SELECT * FROM users WHERE address = ?").get(address);
    }
  }
  return user;
}

app.post("/api/login", (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: "Address required" });

  let user = db.prepare("SELECT * FROM users WHERE address = ?").get(address);
  if (!user) {
    db.prepare("INSERT INTO users (address, balance, staked_amount) VALUES (?, ?, ?)")
      .run(address, 1000.0, 0.0);
    user = db.prepare("SELECT * FROM users WHERE address = ?").get(address);
  }
  res.json(user);
});

app.get("/api/stats/:address", (req, res) => {
  const user = getUser(req.params.address);
  if (!user) return res.status(404).json({ error: "User not found" });

  const totalElapsed = user.session_start_time ? Math.floor((Date.now() - user.session_start_time) / 1000) : 0;
  let multiplier = 1.0;
  if (totalElapsed >= 300) multiplier = 2.0;
  else if (totalElapsed >= 120) multiplier = 1.5;

  let rank = "Recruit";
  if (user.staked_amount >= 500) rank = "Overlord";
  else if (user.staked_amount >= 100) rank = "Guardian";

  res.json({ ...user, multiplier, rank, totalElapsed });
});

app.post("/api/stake", (req, res) => {
  const { address, amount } = req.body;
  const user = getUser(address);
  if (!user || user.balance < amount) return res.status(400).json({ error: "Insufficient balance" });

  const now = Date.now();
  const sessionStart = user.session_start_time || now;

  db.prepare("UPDATE users SET balance = balance - ?, staked_amount = staked_amount + ?, session_start_time = ?, last_reward_calc_time = ? WHERE address = ?")
    .run(amount, amount, sessionStart, now, address);

  db.prepare("INSERT INTO history (address, type, amount, timestamp) VALUES (?, ?, ?, ?)")
    .run(address, "Stake", amount, now);

  res.json(getUser(address));
});

app.post("/api/unstake", (req, res) => {
  const { address, amount, panic } = req.body;
  const user = getUser(address);
  if (!user || user.staked_amount < amount) return res.status(400).json({ error: "Insufficient staked amount" });

  const now = Date.now();
  let finalAmount = amount;
  let status = "Completed";

  if (panic) {
    const tax = amount * 0.05;
    finalAmount = amount - tax;
    status = "Panic Exit (5% Tax)";
  }

  const newStakedAmount = user.staked_amount - amount;
  const newSessionStart = newStakedAmount > 0 ? user.session_start_time : null;

  db.prepare("UPDATE users SET balance = balance + ?, staked_amount = ?, session_start_time = ?, last_reward_calc_time = ? WHERE address = ?")
    .run(finalAmount, newStakedAmount, newSessionStart, now, address);

  db.prepare("INSERT INTO history (address, type, amount, timestamp, status) VALUES (?, ?, ?, ?, ?)")
    .run(address, panic ? "Panic Unstake" : "Unstake", amount, now, status);

  res.json(getUser(address));
});

app.get("/api/user-history/:address", (req, res) => {
  const history = db.prepare("SELECT * FROM history WHERE address = ? ORDER BY timestamp DESC").all(req.params.address);
  res.json(history);
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`QubiStake Pro Server running on http://localhost:${PORT}`);
  });
}

startServer();
