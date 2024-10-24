import type { RequestHandler } from './$types';
import type { APIGetUsersMeResponse } from '$features/auth/types';
import { json } from '@sveltejs/kit';
import prisma from '$features/database/prisma';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth();

	if (!session?.user?.id) {
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
		return json({ user: null, session });
	}
	const res: APIGetUsersMeResponse = {
		user,
		session,
	};

	return json(res);
};
