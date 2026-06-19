import React, { useEffect, useRef, useState } from 'react';
import ExerciseSet from './components/ExerciseSet';
import { ExerciseSetConfig } from './utils/ExerciseSetConfig';
import './App.css';

function App() {
  const [exerciseSets, setExerciseSets] = useState<ExerciseSetConfig[]>([]);
  const [timer, setTimer] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [importText, setImportText] = useState('');

  const addSet = () => {
    setExerciseSets(prev => [
      ...prev,
      {
        exerciseLabel: "New Exercise",
        exerciseWeight: 45,
        numberOfSets: 5,
        numberOfReps: 5,
        restTime: 90
      }
    ]);
  };
  const removeSet = (index: number) => {
    setExerciseSets(prev =>
      prev.filter((_, i) => i !== index)
    );
  };

  const updateSet = (
    index: number,
    updated: ExerciseSetConfig
  ) => {
    setExerciseSets(prev =>
      prev.map((set, i) =>
        i === index ? updated : set
      )
    );
  };

  const startGlobalTimer = (seconds: number) => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    let remaining = seconds;

    setTimer(remaining);

    intervalRef.current = setInterval(() => {
      remaining--;

      setTimer(remaining);

      if (remaining <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);


  const handleImportFromText = () => {
    try {
      const importedSets: ExerciseSetConfig[] =
        importText
          .split(/[;\n]/)
          .map(line => line.trim())
          .filter(Boolean)
          .map(line => {
            const [
              exerciseLabel,
              exerciseWeight,
              numberOfSets,
              numberOfReps,
              restTime
            ] = line.split(',');

            return {
              exerciseLabel: exerciseLabel.trim(),
              exerciseWeight: Number(exerciseWeight),
              numberOfSets: Number(numberOfSets),
              numberOfReps: Number(numberOfReps),
              restTime: Number(restTime)
            };
          });

      setExerciseSets(importedSets);
    } catch (err) {
      alert("Invalid import format");
    }
  };

  const handleExportToClipboard = async () => {
    const text = exerciseSets
      .map(set =>
        [
          set.exerciseLabel,
          set.exerciseWeight,
          set.numberOfSets,
          set.numberOfReps,
          set.restTime
        ].join(',')
      )
      .join(';\n');

    await navigator.clipboard.writeText(text);

    alert('Copied to clipboard');
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
        {timer !== null ? `Global Timer: ${timer}s` : exerciseSets.length > 0 ? 'Click any circle to start' : ''}
      </div>
      {exerciseSets.map((config, index) => (
        <ExerciseSet
          key={index}
          config={config}
          remove={() => removeSet(index)}
          updateConfig={(updated) =>
            updateSet(index, updated)
          }
          startGlobalTimer={startGlobalTimer}
        />
      ))}
    </div>
  );
}

export default App;