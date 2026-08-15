// Common client-side error types and helpers

export interface AuthError {
	message: string;
	code?: string;
	details?: unknown;
	type?: 'auth' | 'validation' | 'network' | 'info' | string;
}

export function mapError(err: unknown): AuthError {
	if (err && typeof err === 'object' && 'message' in err) {
		const errorRecord = err as Record<string, unknown> & { message?: string };
		return {
			message: String(errorRecord.message ?? 'Unknown error'),
			code: typeof errorRecord.code === 'string' ? errorRecord.code : undefined,
			details: errorRecord.details,
			type: typeof errorRecord.type === 'string' ? errorRecord.type : undefined,
		};
	}
	return { message: String(err ?? 'Unknown error') };
}

// Note: no default export for a type-only symbol
 