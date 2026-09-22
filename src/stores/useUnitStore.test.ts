import { describe, it, expect } from 'vitest';
import { useUnitStore } from './useUnitStore'

describe('useUnitStore', () => {
    it('toggles between F and C', () => {
        useUnitStore.getState().toggleUnit();
        expect(useUnitStore.getState().unit).toBe('C');
        useUnitStore.getState().toggleUnit();
        expect(useUnitStore.getState().unit).toBe('F');
    })
})