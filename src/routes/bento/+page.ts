import { getBentos } from '$lib/features/bento/api';
import { redirect } from '@sveltejs/kit';

export const load = async ({ parent, fetch }) => {
	const { queryClient, user } = await parent();

	await queryClient.prefetchQuery({
		queryKey: ['bentos'],
		queryFn: async () => await getBentos({ fetch }),
	});

	if (!user.bentos?.length) {
		throw redirect(303, '/bento/create');
	}

	throw redirect(303, `/bento/${user.bentos[0].slug}`);
};
