import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$features/database/prisma';
import type { APIGetBentoResponse } from '$lib/features/bento/types/api';
import type { Bento } from '@prisma/client';

// Get single Bento
export const GET: RequestHandler = async ({ locals, params }) => {
	const session = await locals.auth();
	const slug = params.slug;

	if (!session?.user?.id) {
		console.warn('not logged in');
		return json({ bento: null }, { status: 401 });
	}

	const bento: APIGetBentoResponse | null = await prisma.bento
		.findUnique({
			where: {
				slug_ownerId: {
					slug,
					ownerId: session.user.id,
				},
			},
			include: {
				links: true,
			},
		})
		.catch(() => {
			return null;
		});

	if (!bento) {
		console.warn('bento not found');
		return json({ bento: null }, { status: 404 });
	}

	return json(bento);
};

// Update Bento
export const PUT: RequestHandler = async ({ locals, request, params: { slug } }) => {
	const session = await locals.auth();
	const newBentoData: Partial<Bento> = (await request.json()) as Partial<Bento>;

	if (!session?.user?.id) {
		throw new Response(null, { status: 401 });
	}

	const bento = await prisma.bento.update({
		where: {
			slug_ownerId: {
				slug,
				ownerId: session.user.id,
			},
		},
		data: newBentoData,
	});

	return json({ bento }, {});
};
