export const lines = (value: string): string[] =>
  value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
export const readableMessages = <T>(items: T[]): T[] => [...items].reverse();
export function canApply(
  opening: { actionable: boolean; applicationUrl: string | null; expiresAt: string },
  now = Date.now(),
): boolean {
  if (
    !opening.actionable ||
    !opening.applicationUrl ||
    Date.parse(opening.expiresAt) <= now ||
    !Number.isFinite(Date.parse(opening.expiresAt))
  )
    return false;
  try {
    const url = new URL(opening.applicationUrl);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}
