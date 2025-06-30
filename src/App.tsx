// App.tsx
import React, { useEffect, useState } from 'react';
import CircleSet from './components/CircleSet';
import { getSavedProfiles, saveProfile, loadProfile, deleteProfile, CircleSetConfig} from './utils/profileStorage';
import './App.css';

function App() {
  const [sets, setSets] = useState<number[]>([]);
  const [profileName, setProfileName] = useState('');
  const [availableProfiles, setAvailableProfiles] = useState<string[]>([]);

  useEffect(() => {
    setAvailableProfiles(getSavedProfiles());
  }, []);

  // const handleSaveProfile = () => {
  //   if (!profileName.trim()) return;
  //   saveProfile(profileName, sets);
  //   setAvailableProfiles(getSavedProfiles());
  //   alert(`Profile "${profileName}" saved!`);
  // };

  // const handleLoadProfile = (name: string) => {
  //   const ids = loadProfile(name);
  //   if (ids) setSets(ids);
  // };

  // const handleDeleteProfile = (name: string) => {
  //   deleteProfile(name);
  //   setAvailableProfiles(getSavedProfiles());
  //   if (profileName === name) setProfileName('');
  // };
  const handleSaveProfile = () => {
  const profileData: Record<string, CircleSetConfig> = {};

  sets.forEach(id => {
    const raw = localStorage.getItem(`circleSet-${id}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      profileData[id] = {
        label: parsed.label,
        start_number: parsed.startNum,
        time: parsed.timeLimit,
        number_of_circles: parsed.circleCount
      };
    }
  });

    if (profileName.trim() && Object.keys(profileData).length > 0) {
      saveProfile(profileName.trim(), profileData);
      setAvailableProfiles(getSavedProfiles());
      alert(`Saved profile "${profileName}"`);
    }
  };

  const handleLoadProfile = (name: string) => {
    const data = loadProfile(name);
    if (!data) return;

    const ids = Object.keys(data);
    ids.forEach(id => {
      const config = data[id];
      localStorage.setItem(`circleSet-${id}`, JSON.stringify({
        label: config.label,
        startNum: config.start_number,
        timeLimit: config.time,
        circleCount: config.number_of_circles,
        circles: Array.from({ length: config.number_of_circles }, (_, i) => ({ id: i, value: null }))
      }));
    });

    setSets(ids.map(id => parseInt(id)));
  };

  const handleDeleteProfile = (name: string) => {
    deleteProfile(name);
    setAvailableProfiles(getSavedProfiles());
  };


  // useEffect(() => {
  //   const saved = localStorage.getItem('circleSetKeys');
  //   if (saved) {
  //     setSets(JSON.parse(saved));
  //   } else {
  //     setSets([0]);
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem('circleSetKeys', JSON.stringify(sets));
  // }, [sets]);

  // const addSet = () => setSets([...sets, sets.length]);
  const addSet = () => setSets([...sets, Date.now()]);
  const removeSet = (index: number) => setSets(sets.filter((_, i) => i !== index));

  return (
    <div className="app">
      <div className="profile-bar">
        <input
          placeholder="Profile name"
          value={profileName}
          onChange={e => setProfileName(e.target.value)}
        />
        <button onClick={handleSaveProfile}>💾 Save</button>
        <select onChange={e => handleLoadProfile(e.target.value)} defaultValue="">
          <option value="" disabled>Load Profile</option>
          {availableProfiles.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button onClick={() => handleDeleteProfile(profileName)}>🗑 Delete</button>
      </div>

      {sets.map((key, index) => (
        // <CircleSet key={key} index={index} remove={() => removeSet(index)} />
        <CircleSet key={key} index={index} id={key} remove={() => removeSet(index)} autoCreate={true} />
      ))}
      <button className="add-set-btn" onClick={addSet}>＋ Add Set</button>
    </div>
  );
}

export default App;