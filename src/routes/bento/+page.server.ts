import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	//  get first bento from user and redirect to /bento/{firstBentoSlug}/
	const session = await event.locals.auth();
	const user = await prisma.user.findUnique({
		where: {
			email: session?.user?.email ?? undefined,
		},
		include: {
			bentos: {
				include: {
					links: true,
				},
			},
		},
	});

	const firstBento = user?.bentos[0];
	if (firstBento) {
		return redirect(303, `/bento/${firstBento.slug}`);
	}

	return redirect(303, '/');
};
