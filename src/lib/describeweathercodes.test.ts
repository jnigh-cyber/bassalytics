import { describe, it, expect } from 'vitest';
import { describeWeatherCodes } from './describeweathercodes';

describe('describeWeatherCodes', () => {
    it('maps known weather codes to their correct label.', () => {
        expect(describeWeatherCodes(0)).toBe('Clear Skies');
        expect(describeWeatherCodes(95)).toBe('Thunder Storms');
        expect(describeWeatherCodes(65)).toBe('Heavy Rain');
    })

    it('returns Unknown for unmapped code.', () => {
        expect(describeWeatherCodes(480)).toBe('Unknown');
    })
});
