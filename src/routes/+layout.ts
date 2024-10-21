import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';
import type { LayoutLoad } from './$types';
import { getMe } from '$features/auth/api/queries';

export const load: LayoutLoad = async ({ fetch }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				networkMode: 'offlineFirst',
			},
		},
	});

	const { user, session } = await getMe({ fetch });

	return {
		user,
		session,
		queryClient,
	};
};
