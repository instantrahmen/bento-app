import type { LayoutLoad } from './$types';
import { QueryClient } from '@tanstack/svelte-query';
import { browser } from '$app/environment';
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
