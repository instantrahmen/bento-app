import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getMultipleCollectionsIcons } from '$features/icon-select/api/iconify';
import { defaultIconsSets } from '$features/icon-select/default-icons-sets';
import { getBentos } from '$lib/features/bento/api';

export const load = (async ({ params: { slug }, parent, fetch }) => {
	const { queryClient, session, user } = await parent();

	if (!user?.id || !session?.user?.id) {
		throw redirect(303, `/`);
	}

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
