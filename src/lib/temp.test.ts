import { describe, it, expect } from 'vitest';
import { cToF } from './units';

describe('Celsius to Fahrenheit function', () => {
    it('Converts celsius to fahrenheit', () => {
        expect(cToF(0)).toBe(32);
        expect(cToF(100)).toBe(212);
    })
});