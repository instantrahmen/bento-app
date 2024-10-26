import type { PageLoad } from './$types';
import { queries } from '$features/bento/api/queries';

export const load: PageLoad = async ({ parent, params, fetch }) => {
	const { queryClient } = await parent();

	await queryClient.prefetchQuery(queries.bento({ slug: params.slug, fetch }));
};
