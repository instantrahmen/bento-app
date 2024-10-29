import type { RequestHandler } from './$types';
import type {
	APIGetBentosResponse,
	APIPostBentosBody,
	APIPostBentosResponse,
} from '$lib/features/bento/types/api';
import { json } from '@sveltejs/kit';
import prisma from '$features/database/prisma';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth();

	if (!session?.user?.id) {
		return json({ bentos: [] });
		// throw new Response(null, { status: 401 });
	}

	const bentos: APIGetBentosResponse = await prisma.bento
		.findMany({
			where: {
				owner: {
					id: session.user.id,
				},
			},
			include: {
				links: true,
			},
		})
		.catch(() => {
			return [];
		});

	if (!bentos || bentos.length === 0) {
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
		return json(
			{
				error: `Missing required fields: ${missingFields.join(', ')}`,
			},
			{
				status: 400,
			}
		);
	}

	const bento: APIPostBentosResponse | null = await prisma.bento
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
		.catch((e) => {
			console.error(e);
			return null;
			// return json({ error: 'Failed to create bento' }, { status: 500 });
		});

	if (!bento) {
		return json({ error: 'Failed to create bento' }, { status: 400 });
	}

	return json(bento);
};
