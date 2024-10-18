import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$features/database/prisma';
import type { APIGetBentoResponse } from '$lib/features/bento/types/api';

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

// // Create new Bento
// export const PUT: RequestHandler = async ({ locals, request }) => {
// 	const session = await locals.auth();
// 	const { title, slug, icon } = (await request.json()) as APIPostBentosBody;

// 	if (!session?.user?.id) {
// 		throw new Response(null, { status: 401 });
// 	}

// 	const missingFields = [
// 		['title', title],
// 		['slug', slug],
// 		['icon', icon],
// 	]
// 		.filter((field) => !field[1])
// 		.map((field) => field[0]);

// 	if (missingFields.length > 0) {
// 		throw json(
// 			{
// 				error: `Missing required fields: ${missingFields.join(', ')}`,
// 			},
// 			{
// 				status: 400,
// 			}
// 		);
// 	}

// 	const bento: APIPostBentosResponse = await prisma.bento
// 		.create({
// 			data: {
// 				title,
// 				slug,
// 				icon,
// 				owner: {
// 					connect: {
// 						id: session.user.id,
// 					},
// 				},
// 			},
// 		})
// 		.catch(() => {
// 			throw new Response(null, { status: 500 });
// 		});

// 	return json({ bento }, {});
// };
