import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ parent, fetch }) => {
	const { user, session } = await parent();
	if (user?.id && session?.user?.id) {
		throw redirect(303, `/bento/${user.bentos?.[0]?.slug || 'create'}`);
	}
	return {};
}) satisfies PageLoad;
