import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$features/database/prisma';
import type { APIGetUsersMeResponse } from '$features/auth/types';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth();

	if (!session?.user?.id) {
		throw new Response(null, { status: 401 });
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
		throw new Response(null, { status: 404 });
	}

	const res: APIGetUsersMeResponse = {
		user,
		session,
	};

	return json(res, {
		headers: {
			'Cache-Control': 'max-age=60',
		},
	});
};
