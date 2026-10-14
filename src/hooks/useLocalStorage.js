import { useEffect, useState } from 'react';

// Same API as useState, but the value survives page reloads.
// Uses its own key prefix so "Clear cache" never wipes user preferences.
export function useLocalStorage(key, initialValue) {
  const storageKey = `odyssey-pref:${key}`;

  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw === null ? initialValue : JSON.parse(raw);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // storage blocked or full: state still works in memory
    }
  }, [storageKey, value]);

  return [value, setValue];
}
