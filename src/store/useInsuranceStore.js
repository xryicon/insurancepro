import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useInsuranceStore = create(
  persist(
    (set) => ({
      // State
      carInsuranceData: {},
      homeInsuranceData: {},

      // Actions
      setCarInsuranceData: (data) =>
        set({ carInsuranceData: { ...data } }),
      setHomeInsuranceData: (data) =>
        set({ homeInsuranceData: { ...data } }),
      resetCarInsuranceData: () => set({ carInsuranceData: {} }),
      resetHomeInsuranceData: () => set({ homeInsuranceData: {} }),
      resetAll: () =>
        set({ carInsuranceData: {}, homeInsuranceData: {} }),
    }),
    {
      name: 'insurance-storage', // Key for localStorage
      partialize: (state) => ({
        carInsuranceData: state.carInsuranceData,
        homeInsuranceData: state.homeInsuranceData,
      }),
    }
  )
);

export default useInsuranceStore;
