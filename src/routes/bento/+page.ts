import { redirect } from '@sveltejs/kit';
import { queries } from '$features/bento/api/queries';

export const load = async ({ parent, fetch }) => {
	const { queryClient, user } = await parent();

	await queryClient.prefetchQuery(queries.bentos({ fetch }));

	if (!user) {
		throw redirect(303, '/');
	}

	if (!user?.bentos?.length) {
		throw redirect(303, '/bento/create');
	}

	throw redirect(303, `/bento/${user.bentos[0].slug}`);
};
