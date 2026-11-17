import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessBranches, parseRemoteHeads } from './archivist-audit.ts';
const sha = 'a'.repeat(40);
const head = (name: string) => ({ name, sha });
test('allows main plus at most five other branches', () => {
  const six = ['main', 'pilot', 'pilot-base', 'ci', 'product', 'governance'].map(head);
  assert.equal(assessBranches(six).compliant, true);
  assert.equal(assessBranches([...six, head('seventh')]).compliant, false);
});
test('the branch count alone cannot hide a missing main', () => {
  assert.equal(assessBranches([head('develop')]).compliant, false);
});
test('counts only branch heads, not archived tags or HEAD aliases', () => {
  const refs = `${sha}\trefs/heads/main\n${sha}\trefs/tags/archive/old\n${sha}\trefs/tags/archive/old^{}\n${sha}\tHEAD\n`;
  assert.deepEqual(parseRemoteHeads(refs), [head('main')]);
});
test('preserves full ref names and accepts SHA-256 repositories', () => {
  assert.deepEqual(
    parseRemoteHeads(`${'b'.repeat(64)}\trefs/heads/feature/player-development\r\n`),
    [{ name: 'feature/player-development', sha: 'b'.repeat(64) }],
  );
});
test('rejects malformed or duplicate refs rather than falsely passing an audit', () => {
  assert.throws(() => parseRemoteHeads('not a ref'), /Malformed/);
  assert.throws(
    () => parseRemoteHeads(`${sha}\trefs/heads/main\n${sha}\trefs/heads/main`),
    /Duplicate/,
  );
});
test('returns an actionable inventory with the actual count and cap', () => {
  const report = assessBranches([head('main'), head('feature/pilot')]);
  assert.equal(report.branchCount, 2);
  assert.equal(report.maximumBranches, 6);
  assert.deepEqual(report.problems, []);
});

test('main must also remain the actual remote default branch', () => {
  assert.equal(assessBranches([head('main'), head('develop')], 'develop').compliant, false);
});
