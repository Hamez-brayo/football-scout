/** Only our explicitly isolated development project may accept emulator tokens. */
export function localAuthEmulator(): boolean {
  if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) return false;
  if (
    process.env.NODE_ENV !== 'development' ||
    process.env.FIREBASE_PROJECT_ID !== 'demo-vysion-pilot' ||
    process.env.FIREBASE_AUTH_EMULATOR_HOST !== '127.0.0.1:9099'
  ) {
    throw new Error('Invalid local pilot authentication configuration.');
  }
  return true;
}
