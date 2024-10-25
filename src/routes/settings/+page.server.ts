import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { session, user } = await parent();

	if (!session?.user?.id || !user?.id) {
		throw redirect(303, '/');
	}

	return {
		session,
		user,
	};
};
