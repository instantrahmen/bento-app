import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ parent, fetch }) => {
	const { user, session } = await parent();
	if (user?.id && session?.user?.id) {
		throw redirect(303, `/bento/${user.bentos[0].slug}`);
	}
	return {};
}) satisfies PageLoad;
