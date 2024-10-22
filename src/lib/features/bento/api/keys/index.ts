import type {
	APIGetBentosOptions,
	APIGetBentosResponse,
	APIGetBentoResponse,
} from '../../types/api';
import { type QueryKey } from '@tanstack/svelte-query';
import { getBento, getBentos } from '../queries';

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
		queryKey: ['bentos', 'bento', { slug: options.slug }],
	}),
};
