import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth();
	if (!session || !session.user || !session.user.email) {
		console.log(session, session?.user, session?.user);
		throw redirect(303, '/auth/signin');
	}

	// Get user info
	const user = await prisma.user.findUnique({
		where: {
			email: session.user.email,
		},
		include: {
			bentos: {
				include: {
					links: true,
				},
			},
		},
	});

	return {
		user,
		session,
	};
};
