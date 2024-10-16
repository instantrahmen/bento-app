import { getBentos } from '$lib/features/bento/api';
import type { LayoutLoad } from './$types';

export const load = (async ({ params: { slug }, parent, fetch }) => {
	const { queryClient } = await parent();

	await queryClient.prefetchQuery({
		queryKey: ['bentos'],
		queryFn: async () => await getBentos({ fetch }),
	});

	return {
		slug,
	};
}) satisfies LayoutLoad;
