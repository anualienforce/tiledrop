import { create } from "zustand";

interface AccessibilityState {
  colorBlindMode: boolean;
  highContrastMode: boolean;
  reducedMotion: boolean;
  
  toggleColorBlindMode: () => void;
  toggleHighContrastMode: () => void;
  toggleReducedMotion: () => void;
}

const loadAccessibilitySetting = (key: string, defaultValue: boolean): boolean => {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  } catch (err) {
    console.warn(`Failed to load ${key} setting:`, err);
    return defaultValue;
  }
};

const saveAccessibilitySetting = (key: string, value: boolean) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to save ${key} setting:`, err);
  }
};

export const useAccessibility = create<AccessibilityState>((set, get) => ({
  colorBlindMode: loadAccessibilitySetting('colorBlindMode', false),
  highContrastMode: loadAccessibilitySetting('highContrastMode', false),
  reducedMotion: loadAccessibilitySetting('reducedMotion', false),
  
  toggleColorBlindMode: () => {
    const newValue = !get().colorBlindMode;
    set({ colorBlindMode: newValue });
    saveAccessibilitySetting('colorBlindMode', newValue);
    console.log('Color-blind mode:', newValue ? 'enabled' : 'disabled');
  },
  
  toggleHighContrastMode: () => {
    const newValue = !get().highContrastMode;
    set({ highContrastMode: newValue });
    saveAccessibilitySetting('highContrastMode', newValue);
    console.log('High contrast mode:', newValue ? 'enabled' : 'disabled');
  },
  
  toggleReducedMotion: () => {
    const newValue = !get().reducedMotion;
    set({ reducedMotion: newValue });
    saveAccessibilitySetting('reducedMotion', newValue);
    console.log('Reduced motion:', newValue ? 'enabled' : 'disabled');
  }
}));
