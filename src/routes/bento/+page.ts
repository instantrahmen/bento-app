import { redirect } from '@sveltejs/kit';
import { getBentos } from '$lib/features/bento/api';

export const load = async ({ parent, fetch }) => {
	const { queryClient, user } = await parent();

	await queryClient.prefetchQuery({
		queryKey: ['bentos', user?.id],
		queryFn: async () => await getBentos({ fetch }),
	});

	if (!user) {
		throw redirect(303, '/');
	}

	if (!user?.bentos?.length) {
		throw redirect(303, '/bento/create');
	}

	throw redirect(303, `/bento/${user.bentos[0].slug}`);
};
