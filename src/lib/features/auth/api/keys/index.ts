import type { APIGetUsersMeResponse } from '../../types/api';
import type { APIQueryOptionsBase } from '$lib/types/api';
import { type QueryKey, type QueryFunction } from '@tanstack/svelte-query';
import { getMe } from '../queries';

export type BentoQueryKey<T = unknown> = {
	queryKey: QueryKey;
	queryFn: () => Promise<T>;
};
export const keys = {
	me: (options: APIQueryOptionsBase): BentoQueryKey<APIGetUsersMeResponse> => ({
		queryFn: async () => await getMe(options),
		queryKey: ['users', 'me'],
	}),
};
