// App.js
import { useEffect, useState } from 'react';
import { generateScramble } from './utils/scramble';
// import CubeSelector from './components/CubeSelector';
import Timer from './components/Timer';

function App() {
  // ✅ cubeType persists in localStorage (like your current code)
  const [cubeType, setCubeType] = useState(
    () => localStorage.getItem('cubeType') || '3x3'
  );

  const [scramble, setScramble] = useState(generateScramble(cubeType));
  const [solves, setSolves] = useState(
    JSON.parse(localStorage.getItem('solves')) || []
  );

  // ✅ Update scramble when cube type changes
  useEffect(() => {
    setScramble(generateScramble(cubeType));
    localStorage.setItem('cubeType', cubeType); // persist cubeType
  }, [cubeType]);

  // ✅ Handle solve completion
  const handleSolve = (time) => {
    const newSolve = {
      cubeType,
      time,
      penalty: null,
      date: new Date().toISOString(),
    };
    const updated = [...solves, newSolve];
    setSolves(updated);
    localStorage.setItem('solves', JSON.stringify(updated));
    setScramble(generateScramble(cubeType));
  };

  // ✅ Apply penalties (+2, DNF)
  const applyPenalty = (index, type) => {
    const updated = [...solves];
    updated[index].penalty = type;
    setSolves(updated);
    localStorage.setItem('solves', JSON.stringify(updated));
  };

  return (
    <div className="p-5 text-center">
      {/* <CubeSelector cubeType={cubeType} setCubeType={setCubeType} /> */}
      <h2 className="mb-4">{scramble}</h2>
      <Timer onSolve={handleSolve} cubeType={cubeType} setCubeType={setCubeType} />
      <h3 className="mt-4">Solve History</h3>
      <ul>
        {solves.map((s, i) => (
          <li key={i}>
            {i + 1}. [{s.cubeType}] {(s.time / 1000).toFixed(2)}s{' '}
            {s.penalty && `(${s.penalty})`}
            <button onClick={() => applyPenalty(i, '+2')}>+2</button>
            <button onClick={() => applyPenalty(i, 'DNF')}>DNF</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
