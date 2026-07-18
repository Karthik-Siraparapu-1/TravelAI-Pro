import { create } from 'zustand';

interface TravelState {
  preferences: any;
  setPreferences: (data: any) => void;
  itineraryData: any;
  setItineraryData: (data: any) => void;
}

export const useTravelStore = create<TravelState>((set) => ({
  preferences: null,
  setPreferences: (data) => set({ preferences: data }),
  itineraryData: null,
  setItineraryData: (data) => set({ itineraryData: data }),
}));
