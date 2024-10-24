import type { APIGetBentosOptions, APIGetBentoLinkOptions } from '../../types/api';
import { queryOptions } from '@tanstack/svelte-query';
import { getBento, getBentoLink, getBentos } from '../queries';
import { minutes } from '$lib/utils/time';

export const queries = {
	bentos: (options: APIGetBentosOptions) =>
		queryOptions({
			queryFn: async () =>
				await getBentos(options).catch((e) => {
					throw new Error(e);
				}),
			queryKey: ['bentos'],
			staleTime: minutes(5),
		}),
	bento: (
		options: APIGetBentosOptions & {
			slug: string;
		}
	) =>
		queryOptions({
			queryFn: async () =>
				await getBento(options).catch((e) => {
					throw new Error(e);
				}),
			queryKey: ['bentos', { slug: options.slug }],
			staleTime: minutes(5),
		}),

	bentoLink: (options: APIGetBentoLinkOptions) =>
		queryOptions({
			queryFn: async () =>
				await getBentoLink(options).catch((e) => {
					throw new Error(e);
				}),
			queryKey: ['bentos', 'bentoLink', { slug: options.bentoSlug, id: options.id }],
			staleTime: minutes(5),
		}),
};

export { queries as keys };
