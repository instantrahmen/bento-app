import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$features/database/prisma';
import type {
	APIGetBentosResponse,
	APIPostBentosBody,
	APIPostBentosResponse,
} from '$lib/features/bento/types/api';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth();

	if (!session?.user?.id) {
		console.warn('not logged in');
		return json({ bentos: [] });
		// throw new Response(null, { status: 401 });
	}

	const bentos: APIGetBentosResponse = await prisma.bento.findMany({
		where: {
			owner: {
				id: session.user.id,
			},
		},
		include: {
			links: true,
		},
	});

	if (!bentos) {
		console.warn('bentos not found');
		return json({ bentos: [] });
		// throw new Response(null, { status: 404 });
	}
	return json(bentos);
};

// Create new Bento
export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth();
	const { title, slug, icon } = (await request.json()) as APIPostBentosBody;

	if (!session?.user?.id) {
		throw new Response(null, { status: 401 });
	}

	const missingFields = [
		['title', title],
		['slug', slug],
		['icon', icon],
	]
		.filter((field) => !field[1])
		.map((field) => field[0]);

	if (missingFields.length > 0) {
		console.warn('Missing required fields', missingFields);
		throw json(
			{
				error: `Missing required fields: ${missingFields.join(', ')}`,
			},
			{
				status: 400,
			}
		);
	}

	const bento: APIPostBentosResponse = await prisma.bento
		.create({
			data: {
				title,
				slug,
				icon,
				owner: {
					connect: {
						id: session.user.id,
					},
				},
			},
		})
		.catch(() => {
			console.error('Failed to create bento');
			throw json({ error: 'Failed to create bento' }, { status: 500 });
		});

	return json({ bento });
};
