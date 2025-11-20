import { create } from 'zustand';

interface DisplayState {
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
}

export const useDisplay = create<DisplayState>((set) => {
  let initialZoom = 1;
  try {
    const saved = localStorage.getItem('zoomLevel');
    if (saved) {
      initialZoom = parseFloat(saved);
    }
  } catch (err) {
    console.warn('Failed to load zoom level from localStorage:', err);
  }

  return {
    zoomLevel: initialZoom,
    setZoomLevel: (level: number) => {
      set({ zoomLevel: level });
      try {
        localStorage.setItem('zoomLevel', level.toString());
      } catch (err) {
        console.warn('Failed to save zoom level to localStorage:', err);
      }
    },
  };
});
