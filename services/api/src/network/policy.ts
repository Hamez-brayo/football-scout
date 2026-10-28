import { AppError } from '../middleware/errorHandler';

export function canonicalPair(first: string, second: string): string {
  if (first === second) throw new AppError(400, 'INVALID_CONNECTION', 'Cannot connect to yourself');
  return JSON.stringify([first, second].sort());
}
export function requireConnectionParticipant(
  connection: { requesterId: string; recipientId: string; status: string },
  actor: string,
): void {
  if (
    ![connection.requesterId, connection.recipientId].includes(actor) ||
    connection.status !== 'ACCEPTED'
  ) {
    throw new AppError(403, 'FORBIDDEN', 'Messaging requires an accepted connection');
  }
}
