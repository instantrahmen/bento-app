import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$features/database/prisma';
import type {
	APIGetBentosResponse,
	APIPostBentosBody,
	APIPostBentosResponse,
} from '$lib/features/bento/types/api';


// Get single Bento
export const GET: RequestHandler = async ({ locals, params }) => {
	const session = await locals.auth();
	const slug = params.slug;

	if (!session?.user?.id) {
		throw new Response(null, { status: 401 });
	}

	const bentos: APIGetBentosResponse = await prisma.bento.findUnique({
		where: {
			owner: {
				id: session.user.id,
				slug,
			},
		},
		include: {
			links: true,
		},
	});

	return json(bentos, {
		headers: {
			'Cache-Control': 'max-age=3600',
		},
	});
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
			throw new Response(null, { status: 500 });
		});

	return json({ bento }, {});
};
