import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue = []) {
  // -------------------------
  // READ FROM LOCAL STORAGE
  // -------------------------
  const readValue = () => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const saved = localStorage.getItem(key);

      if (!saved) return initialValue;

      return JSON.parse(saved);
    } catch (error) {
      console.warn(`Error reading "${key}" from localStorage:`, error);
      return initialValue;
    }
  };

  const [value, setValue] = useState(readValue);

  // -------------------------
  // WRITE TO LOCAL STORAGE
  // -------------------------
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error saving "${key}" to localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}