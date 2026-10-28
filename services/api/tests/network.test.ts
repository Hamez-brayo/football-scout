import { describe, expect, test } from '@jest/globals';
import {
  NetworkPostSchema,
  NetworkPaginationSchema,
  NetworkOrganisationSchema,
} from '../../../packages/shared/src/network';
import { canonicalPair, requireConnectionParticipant } from '../src/network/policy';

describe('network contracts and authorization', () => {
  test('canonical unordered connection pair prevents inverse duplicates', () => {
    expect(canonicalPair('b', 'a')).toEqual(canonicalPair('a', 'b'));
    expect(() => canonicalPair('a', 'a')).toThrow();
  });
  test('rejects unsafe links and owner impersonation', () => {
    expect(
      NetworkPostSchema.safeParse({
        body: 'Goal',
        category: 'MATCH_FOOTAGE',
        mediaUrl: 'javascript:alert(1)',
      }).success,
    ).toBe(false);
    expect(
      NetworkOrganisationSchema.safeParse({
        name: 'Club',
        type: 'CLUB',
        ownerId: 'victim',
      }).success,
    ).toBe(false);
  });
  test('bounds pagination and rejects oversized posts', () => {
    expect(NetworkPaginationSchema.parse({})).toEqual({ page: 1, limit: 20 });
    expect(NetworkPaginationSchema.safeParse({ limit: 101 }).success).toBe(false);
    expect(
      NetworkPostSchema.safeParse({
        body: 'a'.repeat(3001),
        category: 'TRAINING',
      }).success,
    ).toBe(false);
  });
  test('only accepted participants may message', () => {
    const connection = {
      requesterId: 'a',
      recipientId: 'b',
      status: 'ACCEPTED',
    };
    expect(() => requireConnectionParticipant(connection, 'a')).not.toThrow();
    expect(() => requireConnectionParticipant(connection, 'outsider')).toThrow();
    expect(() => requireConnectionParticipant({ ...connection, status: 'PENDING' }, 'b')).toThrow();
  });
});
