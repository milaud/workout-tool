import React, { useEffect, useRef, useState } from 'react';
import ExerciseSet from './components/ExerciseSet';
import { ExerciseSetConfig } from './types/ExerciseSetConfig';
import { DEFAULT_EXERCISE } from './constants/defaultExercise.constants';
import { parseExercise } from './utils/exerciseImport';
import './App.css';

/*
TODO:

-Fix CSS on mobile
--Timer should be bigger and get users attention when finished

-Exports:
If exercise finished (all sets reached):
  if all reps reached: increase 5 lbs
  else say try again

Have button at bottom of page for finish workout?

Export should:
Print current exercises reps/sets done

Create template for next workout w/ increased weight if exercise was completed

*/

function App() {
  const [exerciseSets, setExerciseSets] = useState<ExerciseSetConfig[]>([]);
  const [timer, setTimer] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [importText, setImportText] = useState('');

  const addSet = () => {
    setExerciseSets(prev => [
      ...prev,
      DEFAULT_EXERCISE
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
          .map(parseExercise)
          .filter(
            (exercise): exercise is ExerciseSetConfig => exercise !== null
          );

      setExerciseSets(importedSets);
    } catch (err) {
      alert("Invalid import format");
    }
  };

  const handleExport = async () => {
    const currentWorkout = exerciseSets
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

    const nextWorkoutTemplate = exerciseSets
      .map(set =>
        [
          set.exerciseLabel,
          set.exerciseWeight + 5,
          set.numberOfSets,
          set.numberOfReps,
          set.restTime
        ].join(',')
      )
      .join(';\n');

    const text = `${currentWorkout}\n\nNext workout:\n${nextWorkoutTemplate}`;
    // console.log(text)

    const shareData = {
      title: `${new Date().toLocaleDateString()} Workout`,
      text: text,
    };

    // console.log(shareData)

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('Copied to clipboard');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };


  return (
    <div className="app">
      <div className="import-export">
        <button onClick={handleExport}>📤 Export</button>
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