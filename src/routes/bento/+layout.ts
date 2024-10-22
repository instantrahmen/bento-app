import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { keys } from '$features/bento/api/keys';

export const load = (async ({ params: { slug }, parent, fetch }) => {
	const { queryClient, session, user } = await parent();

	if (!user?.id || !session?.user?.id) {
		throw redirect(303, `/`);
	}

	await queryClient.prefetchQuery(keys.bentos({ fetch }));

	return {
		slug,
	};
}) satisfies LayoutLoad;
