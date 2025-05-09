import type { Accelerator } from './types';

// Storage keys
const STORAGE_KEYS = {
  METRONOME: 'metronome_settings',
  POLYRHYTHM: 'polyrhythm_settings',
  PHASER: 'phaser_settings'
};

// Interfaces for stored settings
interface MetronomeSettings {
  bpm: number;
  timeSignature: string;
  accelerator: Accelerator;
  acceleratorEnabled: boolean;
}

interface PolyrhythmSettings {
  bpm: number;
  ratios: number[];
  accelerator: Accelerator;
  acceleratorEnabled: boolean;
}

interface PhaserSettings {
  bpmList: number[];
}

// Generic function to save settings
const saveSettings = <T>(key: string, settings: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(settings));
  } catch (error) {
    console.error(`Error saving ${key} settings:`, error);
  }
};

// Generic function to load settings
const loadSettings = <T>(key: string, defaultSettings: T): T => {
  try {
    const storedSettings = localStorage.getItem(key);
    return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
  } catch (error) {
    console.error(`Error loading ${key} settings:`, error);
    return defaultSettings;
  }
};

// Specific functions for Metronome
export const saveMetronomeSettings = (settings: MetronomeSettings): void => {
  saveSettings(STORAGE_KEYS.METRONOME, settings);
};

export const loadMetronomeSettings = (defaultSettings: MetronomeSettings): MetronomeSettings => {
  return loadSettings(STORAGE_KEYS.METRONOME, defaultSettings);
};

// Specific functions for Polyrhythm
export const savePolyrhythmSettings = (settings: PolyrhythmSettings): void => {
  saveSettings(STORAGE_KEYS.POLYRHYTHM, settings);
};

export const loadPolyrhythmSettings = (defaultSettings: PolyrhythmSettings): PolyrhythmSettings => {
  return loadSettings(STORAGE_KEYS.POLYRHYTHM, defaultSettings);
};

// Specific functions for Phaser
export const savePhaserSettings = (settings: PhaserSettings): void => {
  saveSettings(STORAGE_KEYS.PHASER, settings);
};

export const loadPhaserSettings = (defaultSettings: PhaserSettings): PhaserSettings => {
  return loadSettings(STORAGE_KEYS.PHASER, defaultSettings);
}; 