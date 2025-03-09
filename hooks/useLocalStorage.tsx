"use client";
import { useEffect, useState } from "react";

type SetValue<T> = T | ((val: T) => T);

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Mengambil data dari localStorage setelah komponen dimount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error("Error reading localStorage:", error);
    }
    setIsInitialized(true);
  }, [key]);

  // Menyimpan data ke localStorage setiap kali `storedValue` berubah
  useEffect(() => {
    if (!isInitialized) return; // Mencegah penyimpanan sebelum state diinisialisasi
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [key, storedValue, isInitialized]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
