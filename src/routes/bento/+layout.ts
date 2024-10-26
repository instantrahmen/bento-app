import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { queries } from '$features/bento/api/queries';

export const load = (async ({ params: { slug }, parent, fetch }) => {
	const { queryClient, session, user } = await parent();

	if (!user?.id || !session?.user?.id) {
		throw redirect(303, `/`);
	}

	await queryClient.prefetchQuery(queries.bentos({ fetch }));

	return {
		slug,
	};
}) satisfies LayoutLoad;
