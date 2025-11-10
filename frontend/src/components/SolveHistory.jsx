import React, { useEffect, useState } from "react";
import axios from "axios";

const SolveHistory = () => {
  const [solves, setSolves] = useState([]);

  useEffect(() => {
    fetchSolves();
  }, []);

  const fetchSolves = async () => {
    const res = await axios.get("http://localhost:5000/api/solves");
    setSolves(res.data);
  };

  const handlePenalty = async (id, penalty) => {
    await axios.put(`http://localhost:5000/api/solves/${id}`, { penalty });
    fetchSolves();
  };

  const deleteSolve = async (id) => {
    await axios.delete(`http://localhost:5000/api/solves/${id}`);
    fetchSolves();
  };

  return (
    <div className="history-container">
      <h2>🧩 Solve History</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Time (s)</th>
            <th>Cube</th>
            <th>Penalty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {solves.map((s, i) => (
            <tr key={s.id}>
              <td>{i + 1}</td>
              <td>{(s.time / 100).toFixed(2)}</td>
              <td>{s.cubeType}</td>
              <td>{s.penalty || "—"}</td>
              <td>
                <button onClick={() => handlePenalty(s.id, "+2")}>+2</button>
                <button onClick={() => handlePenalty(s.id, "DNF")}>DNF</button>
                <button onClick={() => deleteSolve(s.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SolveHistory;
