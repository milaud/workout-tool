// // src/utils/profileStorage.ts
// type ProfileMap = Record<string, number[]>;

// /** Get all saved profile names */
// export function getSavedProfiles(): string[] {
//   const raw = localStorage.getItem('circleProfiles');
//   if (!raw) return [];
//   return Object.keys(JSON.parse(raw));
// }

// /** Save the current set of circleSet IDs under a profile name */
// export function saveProfile(name: string, setIds: number[]) {
//   const raw = localStorage.getItem('circleProfiles');
//   const profiles: ProfileMap = raw ? JSON.parse(raw) : {};
//   profiles[name] = setIds;
//   localStorage.setItem('circleProfiles', JSON.stringify(profiles));
// }

// /** Load a profile by name and return its associated set IDs */
// export function loadProfile(name: string): number[] | null {
//   const raw = localStorage.getItem('circleProfiles');
//   if (!raw) return null;
//   const profiles: ProfileMap = JSON.parse(raw);
//   return profiles[name] || null;
// }

// /** Delete a saved profile by name */
// export function deleteProfile(name: string) {
//   const raw = localStorage.getItem('circleProfiles');
//   if (!raw) return;
//   const profiles: ProfileMap = JSON.parse(raw);
//   delete profiles[name];
//   localStorage.setItem('circleProfiles', JSON.stringify(profiles));
// }
export type CircleSetConfig = {
  label: string;
  start_number: number;
  time: number;
  number_of_circles: number;
};

export type ProfileData = Record<string, CircleSetConfig>; // key = set ID

export type ProfileStore = Record<string, ProfileData>; // key = profile name

const STORAGE_KEY = 'circleProfiles';

export function getSavedProfiles(): string[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return Object.keys(JSON.parse(raw));
}

export function saveProfile(name: string, data: ProfileData) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const store: ProfileStore = raw ? JSON.parse(raw) : {};
  store[name] = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function loadProfile(name: string): ProfileData | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const store: ProfileStore = JSON.parse(raw);
  return store[name] || null;
}

export function deleteProfile(name: string) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const store: ProfileStore = JSON.parse(raw);
  delete store[name];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
