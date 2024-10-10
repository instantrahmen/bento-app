import type { LayoutLoad } from './$types';

// return slug
export const load = (async (event) => {
	const {
		params: { slug },
	} = event;
	return {
		slug,
	};
}) satisfies LayoutLoad;
