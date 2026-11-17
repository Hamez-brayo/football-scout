import { execFileSync } from 'node:child_process';
import path from 'node:path';

export interface BranchHead {
  name: string;
  sha: string;
}
export function parseRemoteHeads(output: string): BranchHead[] {
  const heads: BranchHead[] = [];
  const names = new Set<string>();
  for (const line of output.split(/\r?\n/).filter(Boolean)) {
    const match = line.match(/^([a-f0-9]{40}|[a-f0-9]{64})\trefs\/heads\/(.+)$/);
    if (!match) {
      if (
        /^ref: refs\/heads\/[^\t ]+\tHEAD$/.test(line) ||
        /^([a-f0-9]{40}|[a-f0-9]{64})\t(HEAD|refs\/tags\/.+)$/.test(line)
      )
        continue;
      throw new Error('Malformed Git ref response; audit cannot certify the branch count.');
    }
    const [, sha, name] = match;
    if (names.has(name)) throw new Error('Duplicate Git branch in audit response.');
    names.add(name);
    heads.push({ name, sha });
  }
  return heads.sort((a, b) => a.name.localeCompare(b.name));
}
export function assessBranches(heads: BranchHead[], remoteDefault?: string) {
  const maximumBranches = 6;
  const problems: string[] = [];
  if (remoteDefault !== undefined && remoteDefault !== 'main')
    problems.push('The actual remote default branch must be main.');
  if (!heads.some((head) => head.name === 'main'))
    problems.push('The required main branch is missing.');
  if (heads.length > maximumBranches)
    problems.push(
      `${heads.length} branches exceed main plus five others; archive reviewed inactive work before adding branches.`,
    );
  return { branchCount: heads.length, maximumBranches, compliant: problems.length === 0, problems };
}
function main() {
  const arguments_ = process.argv.slice(2);
  if (arguments_.some((argument) => !['--check', '--offline', '--json'].includes(argument))) {
    throw new Error('Usage: node scripts/archivist-audit.ts [--check] [--offline] [--json]');
  }
  const offline = arguments_.includes('--offline');
  if (offline && arguments_.includes('--check'))
    throw new Error(
      'Offline tracking refs cannot certify the live GitHub branch limit. Use --offline only for a labelled snapshot.',
    );
  let output: string;
  try {
    output = offline
      ? execFileSync(
          'git',
          ['for-each-ref', '--format=%(objectname)\t%(refname)', 'refs/remotes/origin'],
          { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
        )
          .split(/\r?\n/)
          .filter((line) => line && !line.endsWith('refs/remotes/origin/HEAD'))
          .map((line) => line.replace('\trefs/remotes/origin/', '\trefs/heads/'))
          .join('\n')
      : execFileSync('git', ['ls-remote', '--symref', 'origin', 'HEAD', 'refs/heads/*'], {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'pipe'],
          timeout: 30000,
        });
  } catch {
    throw new Error(
      'Cannot read origin branch refs. Check repository access; no refs or files were changed.',
    );
  }
  const heads = parseRemoteHeads(output);
  const remoteDefault = offline
    ? undefined
    : output.match(/^ref: refs\/heads\/([^\r\n\t]+)\tHEAD\r?$/m)?.[1];
  if (!offline && !remoteDefault)
    throw new Error('Cannot verify the remote default branch; no changes made.');
  const report = {
    source: offline ? 'local tracking snapshot (may be stale)' : 'live origin heads',
    liveVerified: !offline,
    remoteDefaultBranch: remoteDefault ?? null,
    ...assessBranches(heads, remoteDefault),
    heads,
  };
  if (arguments_.includes('--json')) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`ARCHIVIST: ${report.source}`);
    console.log(
      `${report.branchCount}/${report.maximumBranches} branch slots used (main plus at most five others).`,
    );
    heads.forEach((head) => console.log(`${head.name}\t${head.sha}`));
    report.problems.forEach((problem) => console.error(problem));
  }
  if (arguments_.includes('--check') && !report.compliant) process.exitCode = 1;
}
if (process.argv[1] && path.basename(process.argv[1]) === 'archivist-audit.ts') {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Audit failed; no changes made.');
    process.exitCode = 2;
  }
}
