import type { PageLoad } from './$types';
import { keys } from '$features/bento/api/keys';

export const load: PageLoad = async ({ parent, params, fetch }) => {
	const { queryClient } = await parent();

	await queryClient.prefetchQuery(keys.bento({ slug: params.slug, fetch }));
};
