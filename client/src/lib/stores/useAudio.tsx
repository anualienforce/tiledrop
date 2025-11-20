import { create } from "zustand";

// Detect if device is tablet
const isTablet = () => {
  const width = window.innerWidth;
  return width >= 481 && width <= 1024;
};

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  
  // Individual volume controls (0-1)
  musicVolume: number;
  hitVolume: number;
  successVolume: number;
  comboVolume: number;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Volume control functions
  setMusicVolume: (volume: number) => void;
  setHitVolume: (volume: number) => void;
  setSuccessVolume: (volume: number) => void;
  setComboVolume: (volume: number) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playCombo: (comboStreak: number) => void;
}

const loadVolume = (key: string, defaultValue: number): number => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? parseFloat(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveVolume = (key: string, value: number) => {
  try {
    localStorage.setItem(key, value.toString());
  } catch (err) {
    console.warn('Failed to save volume:', err);
  }
};

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: false, // Start unmuted by default
  
  // Load volumes from localStorage or use defaults
  musicVolume: loadVolume('musicVolume', 0.3),
  hitVolume: loadVolume('hitVolume', 0.3),
  successVolume: loadVolume('successVolume', 0.5),
  comboVolume: loadVolume('comboVolume', 0.6),
  
  setBackgroundMusic: (music) => {
    const { musicVolume, isMuted } = get();
    const isTabletDevice = isTablet();
    
    // Configure audio element
    music.preload = 'auto';
    music.loop = true;
    music.volume = musicVolume;
    
    // Prevent seeking to ensure full playback
    music.addEventListener('seeking', (e) => {
      console.log('Seeking detected at:', music.currentTime);
    });
    
    // Monitor for unexpected loops
    music.addEventListener('ended', () => {
      console.log('Audio ended at:', music.currentTime, '/', music.duration);
    });
    
    // Force complete load
    music.load();
    
    // Wait for the audio to be fully loaded
    const playWhenReady = () => {
      console.log('Audio ready - Duration:', music.duration, 'seconds, ReadyState:', music.readyState, 'Device:', isTabletDevice ? 'Tablet' : 'Other');
      
      // For tablets, use the same strict validation as mobile
      if (music.duration && music.duration > 10) {
        console.log('Full audio loaded successfully');
        if (!isMuted) {
          music.play().catch(error => {
            console.log("Background music autoplay prevented:", error);
          });
        }
      } else {
        console.warn('Audio duration seems incorrect:', music.duration);
        // For tablets, retry loading if duration is wrong
        if (isTabletDevice && music.duration < 10) {
          console.log('Tablet detected with short duration, reloading audio...');
          music.load();
        }
      }
    };
    
    // Listen for loaded metadata
    music.addEventListener('loadedmetadata', () => {
      console.log('Metadata loaded - Duration:', music.duration);
    }, { once: true });
    
    // Wait for full buffer - critical for tablets
    music.addEventListener('canplaythrough', playWhenReady, { once: true });
    
    // Fallback if already loaded
    if (music.readyState >= 3 && music.duration > 0) {
      playWhenReady();
    }
    
    set({ backgroundMusic: music });
  },
  
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  setMusicVolume: (volume) => {
    const { backgroundMusic } = get();
    if (backgroundMusic) {
      backgroundMusic.volume = volume;
    }
    saveVolume('musicVolume', volume);
    set({ musicVolume: volume });
  },
  
  setHitVolume: (volume) => {
    saveVolume('hitVolume', volume);
    set({ hitVolume: volume });
  },
  
  setSuccessVolume: (volume) => {
    saveVolume('successVolume', volume);
    set({ successVolume: volume });
  },
  
  setComboVolume: (volume) => {
    saveVolume('comboVolume', volume);
    set({ comboVolume: volume });
  },
  
  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const newMutedState = !isMuted;
    
    // Control background music playback
    if (backgroundMusic) {
      if (newMutedState) {
        // Muting - pause background music
        backgroundMusic.pause();
      } else {
        // Unmuting - play background music
        backgroundMusic.play().catch(error => {
          console.log("Background music play prevented:", error);
        });
      }
    }
    
    // Update the muted state
    set({ isMuted: newMutedState });
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted, hitVolume } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = hitVolume;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted, successVolume } = get();
    if (successSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      successSound.volume = successVolume;
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },
  
  playCombo: (comboStreak: number) => {
    const { successSound, isMuted, comboVolume } = get();
    if (successSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Combo sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = successSound.cloneNode() as HTMLAudioElement;
      // Increase pitch based on combo streak (1.0 to 2.0)
      const pitchRate = Math.min(1.0 + (comboStreak * 0.15), 2.0);
      soundClone.playbackRate = pitchRate;
      soundClone.volume = comboVolume;
      soundClone.currentTime = 0;
      soundClone.play().catch(error => {
        console.log("Combo sound play prevented:", error);
      });
    }
  }
}));