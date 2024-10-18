import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$features/database/prisma';
import type { APIGetUsersMeResponse } from '$features/auth/types';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth();

	if (!session?.user?.id) {
		console.warn('not logged in');
		return json({ user: null, session: null });
	}

	const user = await prisma.user
		.findUnique({
			where: {
				id: session.user.id,
			},
			include: {
				bentos: {
					include: {
						links: true,
					},
				},
			},
		})
		.catch(() => null);

	if (!user) {
		console.warn('user not found');
		return json({ user: null, session });
	}
	const res: APIGetUsersMeResponse = {
		user,
		session,
	};

	return json(res);
};
