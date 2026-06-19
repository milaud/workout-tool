import React, { useEffect, useRef, useState } from 'react';
import ExerciseSet from './components/ExerciseSet';
import { ExerciseSetConfig } from './utils/ExerciseSetConfig';
import './App.css';

function App() {
  const [sets, setSets] = useState<number[]>([]);
  const [timer, setTimer] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [importText, setImportText] = useState('');

  const timerLimit = 90;


  const addSet = () => setSets([...sets, Date.now()]);
  const removeSet = (index: number) => setSets(sets.filter((_, i) => i !== index));

  const startGlobalTimer = () => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);

    let remaining = timerLimit;
    setTimer(remaining);
    intervalRef.current = setInterval(() => {
      remaining--;
      setTimer(remaining);
      if (remaining <= 0 && intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  const handleExportToClipboard = () => {
    const exportData: Record<string, ExerciseSetConfig> = {};

    sets.forEach(id => {
      const raw = localStorage.getItem(`circleSet-${id}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        exportData[id] = {
          exerciseLabel: parsed.exerciseLabel,
          exerciseWeight: parsed.exerciseWeight,
          numberOfReps: parsed.numberOfReps,
          restTime: parsed.restTime,
          numberOfSets: parsed.numberOfSets
        };
      }
    });

    const json = JSON.stringify(exportData, null, 2);
    navigator.clipboard.writeText(json)
      .then(() => alert('Exported to clipboard!'))
      .catch(err => alert('Clipboard error: ' + err));
  };

  const handleJSONImportFromText = () => {
    try {
      const parsed = JSON.parse(importText);
      const ids = Object.keys(parsed);

      ids.forEach(id => {
        const config = parsed[id];
        localStorage.setItem(`circleSet-${id}`, JSON.stringify({
          label: config.label,
          startNum: config.start_number,
          timeLimit: config.time,
          circleCount: config.number_of_circles,
          circles: Array.from({ length: config.number_of_circles }, (_, i) => ({ id: i, value: null }))
        }));
      });

      setSets(ids.map(id => parseInt(id)));
      alert('Imported successfully!');
    } catch (err) {
      alert('Invalid JSON: ' + err);
    }
  };

  const handleImportFromText = () => {
    try {
      const lines = importText
        .split(';')
        .map(line => line.trim())
        .filter(Boolean);

      const newSets: number[] = [];

      lines.forEach(line => {
        const [label, startNum, timeLimit, circleCount] =
          line.split(',').map(item => item.trim());

        const id = Date.now() + Math.floor(Math.random() * 10000);

        const config = {
          id,
          label,
          startNum: Number(startNum),
          timeLimit: Number(timeLimit),
          circleCount: Number(circleCount)
        };

        newSets.push(id);

        // Store in whatever state management you're using
        // instead of localStorage
        // addImportedSet(config);
      });


      setSets(newSets);
      alert('Imported successfully!');
    } catch (err) {
      alert('Invalid text: ' + err);
    }
  };

  return (
    <div className="app">
      <div className="import-export">
        {/* <button onClick={handleExportToClipboard}>📋 Export to Clipboard</button> */}
        <textarea
          rows={5}
          placeholder="Paste text here to import"
          value={importText}
          onChange={e => setImportText(e.target.value)}
        />
        <button onClick={handleImportFromText}>📥 Import</button>
      </div>
      <button className="add-set-btn" onClick={addSet}>＋ Add Set</button>
      <div className="global-timer">
        {/* TODO: pin this to the top of the page? */}
        {timer !== null ? `Global Timer: ${timer}s` : sets.length > 0 ? 'Click any circle to start' : ''}
      </div>
      {sets.map((key, index) => (
        <ExerciseSet key={key} index={index} id={key} remove={() => removeSet(index)} autoCreate={true} timer={timer} startGlobalTimer={startGlobalTimer} />
      ))}
    </div>
  );
}

export default App;