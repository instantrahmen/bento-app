import type { LayoutLoad } from '../$types';

export const load = (async ({ params: { slug = 'unknown' }, parent, fetch }) => {
	return {
		slug,
	};
}) satisfies LayoutLoad;
