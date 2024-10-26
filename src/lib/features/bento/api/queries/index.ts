import type {
	APIGetBentosResponse,
	APIGetBentoResponse,
	APIGetBentoOptions,
	APIGetBentosOptions,
	APIGetBentoLinkResponse,
	APIGetBentoLinkOptions,
} from '../../types/api';

import { queryOptions } from '@tanstack/svelte-query';

import { minutes } from '$lib/utils/time';

export const getBentos = async ({
	fetch = globalThis.fetch,
}: APIGetBentosOptions): Promise<APIGetBentosResponse> => {
	const res: APIGetBentosResponse = await fetch('/api/bentos').then((r) => r.json());
	return res;
};

export const getBento = async ({
	fetch = globalThis.fetch,
	slug,
}: APIGetBentoOptions): Promise<APIGetBentoResponse> => {
	if (!slug.trim()) {
		throw new Error('slug is required');
	}
	const res: APIGetBentoResponse = await fetch(`/api/bentos/${slug}`).then((r) => r.json());
	return res;
};

export const getBentoLink = async ({
	fetch = globalThis.fetch,
	id,
	bentoSlug,
}: APIGetBentoLinkOptions): Promise<APIGetBentoLinkResponse | null> => {
	if (!id?.trim()) {
		return null;
	}
	const res: APIGetBentoLinkResponse = await fetch(`/api/bentos/${bentoSlug}/${id}`).then((r) =>
		r.json()
	);
	return res;
};

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
	bento: ({
		slug,
		...options
	}: APIGetBentosOptions & {
		slug?: string;
	}) =>
		queryOptions({
			queryFn: async () => {
				if (!slug) {
					return null;
				}

				return await getBento({
					slug,
					...options,
				}).catch((e) => {
					throw new Error(e);
				});
			},
			queryKey: ['bentos', { slug }],
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
