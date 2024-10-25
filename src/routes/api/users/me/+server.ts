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

// Update user info
export const PUT: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth();
	const _data: Partial<APIGetUsersMeResponse['user']> = await request.json();
	if (!_data) {
		return json({ user: null }, { status: 400 });
	}
	const { email, image, name } = _data;

	if (!session?.user?.id) {
		return json({ user: null, session: null });
	}

	const user = await prisma.user
		.update({
			where: {
				id: session.user.id,
			},
			data: {
				email,
				image,
				name,
			},
		})
		.catch(() => null);

	return json({ user });
};
