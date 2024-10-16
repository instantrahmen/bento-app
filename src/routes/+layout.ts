import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';
import type { LayoutLoad } from './$types';
import { json, redirect } from '@sveltejs/kit';
import { getMe } from '$api/users/me';

export const load: LayoutLoad = async ({ fetch }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
			},
		},
	});

	const { user, session } = await getMe(fetch);

	return {
		user,
		session,
		queryClient,
	};
};
