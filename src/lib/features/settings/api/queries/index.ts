import type { UserSettings } from '@prisma/client';
import { queryOptions } from '@tanstack/svelte-query';

export const queries = {
	settings: ({
		userId,
		fetch = globalThis.fetch,
	}: {
		userId?: string;
		fetch?: typeof globalThis.fetch;
	}) =>
		queryOptions({
			queryFn: async () => {
				if (!userId) {
					return null;
				}
				return fetch('/api/settings').then((r) => r.json()) as Promise<UserSettings>;
			},
			queryKey: ['settings', { userId }],
		}),
};
