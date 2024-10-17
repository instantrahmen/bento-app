import { type QueryKey, type QueryFunction } from '@tanstack/svelte-query';
import { getBento, getBentos } from '../queries';
import type {
	APIGetBentosOptions,
	APIGetBentoOptions,
	APIGetBentosResponse,
	APIGetBentoResponse,
} from '../../types/api';
import type { Writable } from 'svelte/store';
export type BentoQueryKey<T = unknown> = {
	queryKey: QueryKey;
	queryFn: () => Promise<T>;
};
export const keys = {
	bentos: (options: APIGetBentosOptions): BentoQueryKey<APIGetBentosResponse> => ({
		queryFn: async () => await getBentos(options),
		queryKey: ['bentos'],
	}),

	bento: (
		options: APIGetBentosOptions & {
			slug: string;
		}
	): BentoQueryKey<APIGetBentoResponse> => ({
		queryFn: async () => await getBento(options),
		queryKey: ['bento', { slug: options.slug }],
	}),
};
