import { getMultipleCollectionsIcons } from '$features/icon-select/api/iconify';
import { defaultIconsSets } from '$features/icon-select/default-icons-sets';
import { getBentos } from '$lib/features/bento/api';
import type { LayoutLoad } from './$types';

export const load = (async ({ params: { slug }, parent, fetch }) => {
	const { queryClient } = await parent();

	await queryClient.prefetchQuery({
		queryKey: ['bentos'],
		queryFn: async () => await getBentos({ fetch }),
	});

	const iconSets = [...defaultIconsSets];

	await queryClient.prefetchQuery({
		queryKey: ['icons', iconSets],
		queryFn: async () => await getMultipleCollectionsIcons(iconSets),
	});

	return {
		slug,
	};
}) satisfies LayoutLoad;
