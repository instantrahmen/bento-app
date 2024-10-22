import { redirect } from '@sveltejs/kit';
import { keys } from '$features/bento/api/keys';

export const load = async ({ parent, fetch }) => {
	const { queryClient, user } = await parent();

	await queryClient.prefetchQuery(keys.bentos({ fetch }));

	if (!user) {
		throw redirect(303, '/');
	}

	if (!user?.bentos?.length) {
		throw redirect(303, '/bento/create');
	}

	throw redirect(303, `/bento/${user.bentos[0].slug}`);
};
