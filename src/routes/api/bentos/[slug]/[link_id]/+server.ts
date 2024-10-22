import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import prisma from '$features/database/prisma';

export { POST } from '../add/+server';

// Get Bento Link
export const GET: RequestHandler = async ({ locals, params: { slug, link_id } }) => {
	const session = await locals.auth();

	if (!session?.user?.id) {
		throw new Response(null, { status: 401 });
	}

	const link = await prisma.bentoLink
		.findUnique({
			where: {
				id: link_id,
				bento: {
					ownerId: session.user.id,
					slug: slug,
				},
			},
		})
		.catch(() => {
			return null;
		});

	if (!link) {
		throw new Response(null, { status: 404 });
	}

	return json({ link });
};

// Delete Bento Link
export const DELETE: RequestHandler = async ({ locals, params: { slug, link_id } }) => {
	const session = await locals.auth();

	if (!session?.user?.id) {
		throw new Response(null, { status: 401 });
	}

	await prisma.bentoLink.delete({
		where: {
			id: link_id,
			bento: {
				ownerId: session.user.id,
				slug: slug,
			},
		},
	});

	return json({ link: null }, {});
};

// Update Bento Link
export const PUT: RequestHandler = async ({ locals, request, params: { slug, link_id } }) => {
	const session = await locals.auth();
	const { title, url, icon } = (await request.json()) as {
		title?: string;
		url?: string;
		icon?: string;
	};

	if (!session?.user?.id) {
		throw new Response(null, { status: 401 });
	}

	const link = await prisma.bentoLink.update({
		where: {
			id: link_id,
			bento: {
				ownerId: session.user.id,
				slug: slug,
			},
		},
		data: {
			title,
			url,
			icon,
		},
	});

	return json({ link }, {});
};
