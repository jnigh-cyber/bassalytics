import { create } from 'zustand';

type UnitState = {
    unit: 'C' | 'F';
    toggleUnit: () => void;
};

export const useUnitStore = create<UnitState>()((set) => ({
    unit: 'F',
    toggleUnit: () => set((state) => ({unit: state.unit === 'F' ? 'C' : 'F'}))
}));