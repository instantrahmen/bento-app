import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import prisma from '$features/database/prisma';

// Create new Bento Link
export const POST: RequestHandler = async ({ locals, request, params }) => {
	const session = await locals.auth();
	const { title, url, icon } = (await request.json()) as {
		title: string;
		url: string;
		icon: string;
	};

	if (!session?.user?.id) {
		throw new Response(null, { status: 401 });
	}

	const link = await prisma.bentoLink.create({
		data: {
			title,
			url,
			icon,
			bento: {
				connect: {
					slug_ownerId: {
						slug: params.slug,
						ownerId: session.user.id,
					},
				},
			},
		},
	});

	return json({ link }, {});
};
