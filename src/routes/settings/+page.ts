import type { UserSettings } from '@prisma/client';

export const load = async ({ parent }) => {
	const { queryClient, session } = await parent();

	const settingsQueryKey = [
		'settings',
		{
			userId: session?.user?.id,
		},
	];

	await queryClient.prefetchQuery({
		queryKey: settingsQueryKey,
		queryFn: () => {
			if (!session?.user?.id) {
				return null;
			}
			return fetch('/api/settings').then((r) => r.json()) as Promise<UserSettings>;
		},
	});
};
