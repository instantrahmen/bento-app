import type { APIQueryOptionsBase } from '$lib/types/api';
import { queryOptions } from '@tanstack/svelte-query';
import { type APIGetUsersMeResponse } from '$features/auth/types';

export const getMe = async ({
	fetch = globalThis.fetch,
}: APIQueryOptionsBase): Promise<APIGetUsersMeResponse> => {
	const res = (await fetch('/api/users/me').then((r) =>
		r.json()
	)) as Promise<APIGetUsersMeResponse>;
	return res;
};

export const queries = {
	me: (options: APIQueryOptionsBase) =>
		queryOptions({
			queryFn: async () => await getMe(options),
			queryKey: ['users', 'me'],
		}),
};
