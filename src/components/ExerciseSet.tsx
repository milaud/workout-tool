import React, { useEffect, useState } from 'react';
import './ExerciseSet.css';

type Circle = {
  id: number;
  value: number | null;
};

type Props = {
  index: number;
  id: number;
  remove: () => void;
  autoCreate?: boolean,
  timer: number | null,
  startGlobalTimer: () => void;
};

const ExerciseSet: React.FC<Props> = ({ index, id, remove, autoCreate, timer, startGlobalTimer}) => {
  const [exerciseLabel, setExerciseLabel] = useState("New Exercise");
  const [exerciseWeight, setExerciseWeight] = useState(45);
  const [flipped, setFlipped] = useState(false);
  const [numberOfReps, setNumberOfReps] = useState(5);
  const [restTime, setRestTime] = useState(10);
  const [numberOfSets, setNumberOfSets] = useState(5);
  const [numberOfSetCircles, setNumberOfSetCircles] = useState<Circle[]>([]);

  // useEffect(() => {
  //   createCircles();
  //   return () => clearInterval(intervalRef.current!);
  // }, []);


  useEffect(() => {
    // change this to import from clipboard
    /*
    const saved = localStorage.getItem(`circleSet-${id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log(parsed.label)
      setExerciseLabel(parsed.label);
      setWeight(parsed.weight);
      setStartNum(parsed.startNum);
      setRestTime(parsed.timeLimit);
      setNumberOfSets(parsed.circleCount);
      setNumberOfReps(parsed.circles);
    } else if (autoCreate) {
      createCircles(); // not needed?
    }
    */
    if (autoCreate) {
      createCircles();
    }
    // createCircles();    

  }, []);

  useEffect(() => {
    const newNumberOfSets = Array.from({ length: numberOfSets }, (_, i) => ({ id: i, value: null }));
    setNumberOfSetCircles(newNumberOfSets);
  }, [numberOfSets]);

  useEffect(() => {
    const data = {
      exerciseLabel: exerciseLabel,
      exerciseWeight: exerciseWeight,
      numberOfReps: numberOfReps,
      restTime: restTime,
      numberOfSets: numberOfSets
    };
    // localStorage.setItem(`circleSet-${id}`, JSON.stringify(data));
  }, [exerciseLabel, exerciseWeight, numberOfReps, restTime, numberOfSets]);

  const createCircles = () => {
    const newCircles = Array.from({ length: numberOfSets }, (_, i) => ({ id: i, value: null }));
    setNumberOfSetCircles(newCircles);
  };


  const handleCircleClick = (id: number) => {
    setNumberOfSetCircles(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        if (c.value === null) return { ...c, value: numberOfReps };
        if (c.value > 0) return { ...c, value: c.value - 1 };
        if (c.value === 0) return { ...c, value: null };
        return c;
      })
    );
    // startCountdown();
    startGlobalTimer()
  };

  return (
    <div className="set">
      <div className="label-settings">
        <div className="set-config">
          <button className="settings-toggle" onClick={() => setFlipped(!flipped)}>⚙️</button>
          <div className="set-label">{exerciseLabel}</div>
        </div>
        <div>
          <button className="remove-set-btn" onClick={remove}>−</button>
        </div>
      </div>
      <div className='weight-settings'>
        <button onClick={() => setExerciseWeight(prev => prev - 5)}>-</button>
        <div className="set-label">{exerciseWeight} lb</div>
        <button onClick={() => setExerciseWeight(prev => prev + 5)}>+</button>
        </div>


      <div className={`card ${flipped ? 'flipped' : ''}`}>
        <div className="card-side card-front">
          <div className="circle-row">
            {numberOfSetCircles.map(circle => (
              <div
                key={circle.id}
                className={`circle ${circle.value !== null ? 'active' : ''}`}
                onClick={() => handleCircleClick(circle.id)}
              >
                {circle.value !== null ? circle.value : ''}
              </div>
            ))}
          </div>
        </div>
        <div className="card-side card-back">
          <label>
            Exercise:
            <input value={exerciseLabel} onChange={e => setExerciseLabel(e.target.value)} />
          </label>
          <label>
            Weight (lb):
            <input value={exerciseWeight} onChange={e => setExerciseWeight(+e.target.value)} />
          </label>
          <label>
            # of Sets:
            <input type="number" value={numberOfSets} onChange={e => setNumberOfSets(+e.target.value)} />
          </label>
          <label>
            # of Reps:
            <input type="number" value={numberOfReps} onChange={e => setNumberOfReps(+e.target.value)} />
          </label>
          <label>
            Rest Time (sec):
            <input type="number" value={restTime} onChange={e => setRestTime(+e.target.value)} />
          </label>
          {/* <button onClick={createCircles}>Generate Circles</button> */}
        </div>
      </div>
      {/* <div className="timer-display">{timer !== null ? `Time: ${timer}s` : ''}</div> */}
    </div>
  );
};

export default ExerciseSet;