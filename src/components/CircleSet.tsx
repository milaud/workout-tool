// CircleSet.tsx
import React, { useEffect, useRef, useState } from 'react';
import './CircleSet.css';

type Circle = {
  id: number;
  value: number | null;
};

type Props = {
  index: number;
  id: number;
  remove: () => void;
  autoCreate?: boolean
};

const CircleSet: React.FC<Props> = ({ index, id, remove, autoCreate}) => {
  const [label, setLabel] = useState(`Set ${index + 1}`);
  const [flipped, setFlipped] = useState(false);
  const [startNum, setStartNum] = useState(5);
  const [timeLimit, setTimeLimit] = useState(10);
  const [circleCount, setCircleCount] = useState(5);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [timer, setTimer] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   createCircles();
  //   return () => clearInterval(intervalRef.current!);
  // }, []);

  useEffect(() => {
    const saved = localStorage.getItem(`circleSet-${id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log(parsed.label)
      setLabel(parsed.label);
      setStartNum(parsed.startNum);
      setTimeLimit(parsed.timeLimit);
      setCircleCount(parsed.circleCount);
      setCircles(parsed.circles);
    } else if (autoCreate) {
      createCircles(); // not needed?
    }
    // createCircles();

    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const data = {
      label,
      startNum,
      timeLimit,
      circleCount,
      circles
    };
    // localStorage.setItem(`circleSet-${id}`, JSON.stringify(data));
  }, [label, startNum, timeLimit, circleCount, circles]);

  const createCircles = () => {
    const newCircles = Array.from({ length: circleCount }, (_, i) => ({ id: i, value: null }));
    setCircles(newCircles);
    setTimer(null);
    clearInterval(intervalRef.current!);
  };

  const startCountdown = () => {
    clearInterval(intervalRef.current!);
    let remaining = timeLimit;
    setTimer(remaining);
    intervalRef.current = setInterval(() => {
      remaining--;
      setTimer(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
      }
    }, 1000);
  };

  const handleCircleClick = (id: number) => {
    setCircles(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        if (c.value === null) return { ...c, value: startNum };
        if (c.value > 0) return { ...c, value: c.value - 1 };
        if (c.value === 0) return { ...c, value: null };
        return c;
      })
    );
    startCountdown();
  };

  return (
    <div className="set">
      <div className="label-settings">
        <div className="set-label">{label}</div>
        <button className="settings-toggle" onClick={() => setFlipped(!flipped)}>⚙️</button>
        <button className="remove-set-btn" onClick={remove}>−</button>
      </div>

      <div className={`card ${flipped ? 'flipped' : ''}`}>
        <div className="card-side card-front">
          <div className="circle-row">
            {circles.map(circle => (
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
            Label:
            <input value={label} onChange={e => setLabel(e.target.value)} />
          </label>
          <label>
            Start Number:
            <input type="number" value={startNum} onChange={e => setStartNum(+e.target.value)} />
          </label>
          <label>
            Time (sec):
            <input type="number" value={timeLimit} onChange={e => setTimeLimit(+e.target.value)} />
          </label>
          <label>
            Number of Circles:
            <input type="number" value={circleCount} onChange={e => setCircleCount(+e.target.value)} />
          </label>
          {/* <button onClick={createCircles}>Generate Circles</button> */}
        </div>
      </div>

      <div className="timer-display">{timer !== null ? `Time: ${timer}s` : ''}</div>
    </div>
  );
};

export default CircleSet;
