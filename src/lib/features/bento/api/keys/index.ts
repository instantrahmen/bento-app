import type { APIGetBentosOptions, APIGetBentoLinkOptions } from '../../types/api';
import { queryOptions } from '@tanstack/svelte-query';
import { getBento, getBentoLink, getBentos } from '../queries';

export const queries = {
	bentos: (options: APIGetBentosOptions) =>
		queryOptions({
			queryFn: async () => await getBentos(options),
			queryKey: ['bentos'],
			staleTime: 1000 * 60 * 60 * 24,
		}),
	bento: (
		options: APIGetBentosOptions & {
			slug: string;
		}
	) =>
		queryOptions({
			queryFn: async () => await getBento(options),
			queryKey: ['bentos', { slug: options.slug }],
			staleTime: 1000 * 60 * 60 * 24,
		}),

	bentoLink: (options: APIGetBentoLinkOptions) =>
		queryOptions({
			queryFn: async () => await getBentoLink(options),
			queryKey: ['bentos', 'bentoLink', { slug: options.bentoSlug, id: options.id }],
			staleTime: 1000 * 60 * 60 * 24,
		}),
};

export { queries as keys };
