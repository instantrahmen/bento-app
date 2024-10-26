import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { queries as bentoQueries } from '$features/bento/api/queries';
import { queries as settingsQueries } from '$features/settings/api/queries';

export const load = (async ({ params: { slug }, parent, fetch }) => {
	const { queryClient, session, user } = await parent();

	if (!user?.id || !session?.user?.id) {
		throw redirect(303, `/`);
	}

	await queryClient.prefetchQuery(bentoQueries.bentos({ fetch }));

	await queryClient.prefetchQuery(
		settingsQueries.settings({
			userId: session?.user?.id,
		})
	);

	return {
		slug,
	};
}) satisfies LayoutLoad;
