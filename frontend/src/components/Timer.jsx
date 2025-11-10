// Timer.js
import { useState, useEffect, useRef } from "react";

export default function Timer({ cubeType }) {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [inspection, setInspection] = useState(15);
  const [inInspection, setInInspection] = useState(false);
  const [solves, setSolves] = useState([]);

  const inspectionRef = useRef(null);

  const API_BASE = "http://localhost:5000/api/solves";

  // 🧠 Load solves for selected cubeType from backend
  useEffect(() => {
    const fetchSolves = async () => {
      try {
        const res = await fetch(`${API_BASE}/${cubeType}`);
        const data = await res.json();
        setSolves(data);
      } catch (err) {
        console.error("❌ Error fetching solves:", err);
      }
    };
    fetchSolves();
  }, [cubeType]);

  // ⏱️ Timer logic
  useEffect(() => {
    let interval;
    if (running) interval = setInterval(() => setTime((t) => t + 10), 10);
    return () => clearInterval(interval);
  }, [running]);

  // 🧩 Inspection countdown
  const startInspection = () => {
    setInInspection(true);
    setInspection(15);
    let i = 15;
    inspectionRef.current = setInterval(() => {
      i--;
      setInspection(i);
      if (i <= 0) {
        clearInterval(inspectionRef.current);
        setInInspection(false);
        setRunning(true);
      }
    }, 1000);
  };

  // 🧩 End solve → save to DB
  const handleSolveEnd = async (finalTime) => {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cubeType, time: finalTime }),
      });
      const newSolve = await res.json();
      setSolves((prev) => [newSolve, ...prev]);
    } catch (err) {
      console.error("❌ Error saving solve:", err);
    }
  };

  // 🎹 Keyboard logic
  const handleKey = (e) => {
    if (e.code === "Space") {
      e.preventDefault();

      if (running) {
        setRunning(false);
        handleSolveEnd(time);
        setTime(0);
        return;
      }

      if (inInspection) {
        clearInterval(inspectionRef.current);
        setInInspection(false);
        setRunning(true);
        return;
      }

      if (!running && !inInspection) {
        startInspection();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  // 🔧 Solve actions
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      setSolves((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("❌ Error deleting solve:", err);
    }
  };

  const handlePlus2 = async (id, currentPenalty) => {
    const newPenalty = currentPenalty === 0 ? 2000 : 0;
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ penalty: newPenalty, dnf: false }),
      });
      setSolves((prev) =>
        prev.map((s) => (s.id === id ? { ...s, penalty: newPenalty } : s))
      );
    } catch (err) {
      console.error("❌ Error updating +2:", err);
    }
  };

  const handleDNF = async (id, currentDnf, currentPenalty) => {
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ penalty: currentPenalty, dnf: !currentDnf }),
      });
      setSolves((prev) =>
        prev.map((s) => (s.id === id ? { ...s, dnf: !currentDnf } : s))
      );
    } catch (err) {
      console.error("❌ Error updating DNF:", err);
    }
  };

  const handleResetSession = async () => {
    if (!window.confirm(`Reset all ${cubeType} solves?`)) return;
    try {
      await fetch(`${API_BASE}/reset/${cubeType}`, { method: "DELETE" });
      setSolves([]);
    } catch (err) {
      console.error("❌ Error resetting session:", err);
    }
  };

  // 📊 Stats
  const format = (ms) => (ms / 1000).toFixed(2);
  const validSolves = solves.filter((s) => !s.dnf).map((s) => s.time + s.penalty);
  const best = validSolves.length ? Math.min(...validSolves) : null;

  const ao5 =
    validSolves.length >= 5
      ? ((validSolves.slice(0, 5).reduce((a, b) => a + b, 0) / 5) / 1000).toFixed(2)
      : null;

  const ao12 =
    validSolves.length >= 12
      ? ((validSolves.slice(0, 12).reduce((a, b) => a + b, 0) / 12) / 1000).toFixed(2)
      : null;

  // 🧩 UI
  return (
    <div className="text-center space-y-4">
      <h3 className="font-bold text-gray-200">
        Session: {cubeType} ({solves.length} solves)
      </h3>

      {inInspection ? (
        <h2 className="text-yellow-500 text-3xl">Inspection: {inspection}</h2>
      ) : (
        <h1 className="text-6xl font-bold">{format(time)}</h1>
      )}

      <div className="mt-4 text-sm text-gray-300">
        <p>Total Solves: {solves.length}</p>
        <p>Best: {best ? format(best) : "-"}</p>
        <p>Ao5: {ao5 || "-"}</p>
        <p>Ao12: {ao12 || "-"}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-bold">Last 10 Solves</h3>
        <ul className="text-gray-400 space-y-1">
          {solves.slice(0, 10).map((s) => (
            <li key={s.id} className="flex justify-between items-center text-sm">
              <span>
                {s.dnf
                  ? "DNF"
                  : `${((s.time + s.penalty) / 1000).toFixed(2)}s${
                      s.penalty ? " (+2)" : ""
                    }`}
              </span>

              <div className="space-x-2">
                <button
                  onClick={() => handlePlus2(s.id, s.penalty)}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  +2
                </button>
                <button
                  onClick={() => handleDNF(s.id, s.dnf, s.penalty)}
                  className="text-red-400 hover:text-red-300"
                >
                  DNF
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-gray-500 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleResetSession}
        className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm mt-4"
      >
        🧹 Reset {cubeType} Session
      </button>
    </div>
  );
}
