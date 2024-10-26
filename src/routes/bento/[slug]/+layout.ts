import type { LayoutLoad } from '../$types';
import { getBento, getBentos } from '$features/bento/api';
import { keys } from '$features/bento/api/keys';

export const load = (async ({ params: { slug = 'unknown' }, parent, fetch }) => {
	return {
		slug,
	};
}) satisfies LayoutLoad;
