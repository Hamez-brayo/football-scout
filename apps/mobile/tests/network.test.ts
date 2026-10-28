import { describe, expect, it } from '@jest/globals';
import { canApply, readableMessages, lines } from '../src/screens/network/logic';
describe('network presentation safeguards', () => {
  it('requires actionable HTTPS and a future expiry at press time', () => {
    const opening = {
      actionable: true,
      applicationUrl: 'https://club.example/apply',
      expiresAt: '2030-01-01T00:00:00Z',
    };
    expect(canApply(opening, Date.parse('2029-01-01'))).toBe(true);
    expect(canApply(opening, Date.parse('2030-01-01'))).toBe(false);
    expect(canApply({ ...opening, actionable: false }, 0)).toBe(false);
    expect(canApply({ ...opening, applicationUrl: null }, 0)).toBe(false);
    expect(canApply({ ...opening, applicationUrl: 'https://user:pass@club.example' }, 0)).toBe(
      false,
    );
  });
  it('reverses newest-first history without mutating the API page', () => {
    const items = [{ id: 'new' }, { id: 'old' }];
    expect(readableMessages(items).map((x) => x.id)).toEqual(['old', 'new']);
    expect(items[0].id).toBe('new');
  });
  it('normalizes multiline list fields', () => expect(lines(' A\n\n B ')).toEqual(['A', 'B']));
});
