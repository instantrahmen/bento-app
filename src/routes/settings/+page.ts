import { queries } from '$features/settings/api/queries';

export const load = async ({ parent }) => {
	const { queryClient, session } = await parent();

	await queryClient.prefetchQuery(
		queries.settings({
			userId: session?.user?.id,
		})
	);
};
