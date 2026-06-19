import React, { useEffect, useState } from 'react';
import './ExerciseSet.css';
import { ExerciseSetConfig } from '../types/ExerciseSetConfig';

type Circle = {
  id: number;
  value: number | null;
};

/*

Sample data:
Pushups,10,30,5;
Pullups,5,45,3;
Squats,20,60,8

Squat,130,5,5,120
Bench,135,5,5,120
Barbell Row,135,5,5,120
Dumbbell Curl,30,3,8,90

Bench,135,5,5,120;
Barbell Row,135,5,5,120;
Dumbbell Curl,30,3,8,90;

Bench,135,5,5,120;Barbell Row,135,5,5,120;Dumbbell Curl,30,3,8,90;

Bench,135,abc,xyz,120;
Barbell Row,135,5,5,120;
Dumbbell Curl,30,3,8,90;

*/

type Props = {
  config: ExerciseSetConfig;
  remove: () => void;
  updateConfig: (config: ExerciseSetConfig) => void;
  startGlobalTimer: (seconds: number) => void;
};

const ExerciseSet: React.FC<Props> = ({ config, remove, updateConfig, startGlobalTimer }) => {
  const [flipped, setFlipped] = useState(false);
  const [numberOfSetCircles, setNumberOfSetCircles] = useState<Circle[]>([]);
  const {
    exerciseLabel,
    exerciseWeight,
    numberOfSets,
    numberOfReps,
    restTime
  } = config;


  useEffect(() => {
    const newNumberOfSets = Array.from({ length: numberOfSets }, (_, i) => ({ id: i, value: null }));
    setNumberOfSetCircles(newNumberOfSets);
  }, [numberOfSets]);

  /*
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
  */

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
    startGlobalTimer(restTime)
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
        <button onClick={() => updateConfig({ ...config, exerciseWeight: exerciseWeight - 5 })}>-</button>
        <div className="set-label">{exerciseWeight} lb</div>
        <button onClick={() => updateConfig({ ...config, exerciseWeight: exerciseWeight + 5 })}>+</button>
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
            <input value={exerciseLabel} onChange={e => updateConfig({ ...config, exerciseLabel: e.target.value })} />
          </label>
          <label>
            Weight (lb):
            <input value={exerciseWeight} onChange={e => updateConfig({ ...config, exerciseWeight: +e.target.value })} />
          </label>
          <label>
            # of Sets:
            <input type="number" value={numberOfSets} onChange={e => updateConfig({ ...config, numberOfSets: +e.target.value })} />
          </label>
          <label>
            # of Reps:
            <input type="number" value={numberOfReps} onChange={e => updateConfig({ ...config, numberOfReps: +e.target.value })} />
          </label>
          <label>
            Rest Time (sec):
            <input type="number" value={restTime} onChange={e => updateConfig({ ...config, restTime: +e.target.value })} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSet;