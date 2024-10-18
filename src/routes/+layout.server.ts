import type { LayoutServerLoad } from './$types';
import { getMe } from '$features/auth/api/queries';

export const load: LayoutServerLoad = async ({ fetch, locals }) => {
	const session = await locals.auth();
	const { user } = await getMe({ fetch });

	return {
		user,
		session,
	};
};
