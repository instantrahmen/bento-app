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
			slug?: string;
		}
	) =>
		queryOptions({
			queryFn: async () => {
				if (!options.slug) {
					return null;
				}
				const { slug } = options;

				return await getBento({ slug }).catch((e) => {
					throw new Error(e);
				});
			},
			queryKey: ['bentos', { slug: options.slug }],
			staleTime: minutes(5),
		}),

	bentoLink: (options: APIGetBentoLinkOptions) =>
		queryOptions({
			queryFn: async () => {
				if (!options.id) {
					return null;
				}
				if (!options.bentoSlug) {
					throw new Error('slug is required');
				}
				return await getBentoLink(options).catch(() => {
					throw new Error('bento link not found');
				});
			},
			queryKey: ['bentos', 'bentoLink', { slug: options.bentoSlug, id: options.id }],
			staleTime: minutes(5),
		}),
};

export { queries as keys };
