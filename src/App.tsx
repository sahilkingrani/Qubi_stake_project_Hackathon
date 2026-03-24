import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [address, setAddress] = useState<string | null>(localStorage.getItem("qubi_address"));

  useEffect(() => {
    if (address) {
      localStorage.setItem("qubi_address", address);
    } else {
      localStorage.removeItem("qubi_address");
    }
  }, [address]);

  return (
    <Router>
      <div className="min-h-screen bg-[#05070A] text-white">
        <Routes>
          <Route 
            path="/" 
            element={address ? <Navigate to="/dashboard" /> : <Login onLogin={setAddress} />} 
          />
          <Route 
            path="/dashboard" 
            element={address ? <Dashboard address={address} onLogout={() => setAddress(null)} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}
