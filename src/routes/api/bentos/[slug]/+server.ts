import type { RequestHandler } from './$types';
import type { APIGetBentoResponse } from '$lib/features/bento/types/api';
import type { Bento } from '@prisma/client';
import { json } from '@sveltejs/kit';
import prisma from '$features/database/prisma';

// Get single Bento
export const GET: RequestHandler = async ({ locals, params }) => {
	const session = await locals.auth();
	const slug = params.slug;

	if (!session?.user?.id) {
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
		return json({ bento: null }, { status: 404 });
	}

	return json(bento);
};

// Update Bento
export const PUT: RequestHandler = async ({ locals, request, params: { slug } }) => {
	const session = await locals.auth();
	const { description, icon, title }: Partial<Bento> = (await request.json()) as Partial<Bento>;

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
		data: {
			description,
			icon,
			title,
		},
	});

	return json({ bento }, {});
};

// Delete Bento
export const DELETE: RequestHandler = async ({ locals, params: { slug } }) => {
	const session = await locals.auth();

	if (!session?.user?.id) {
		throw new Response(null, { status: 401 });
	}

	await prisma.bento.delete({
		where: {
			slug_ownerId: {
				slug,
				ownerId: session.user.id,
			},
		},
	});

	return json({ bento: null }, {});
};
