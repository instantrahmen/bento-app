// slugify

import prisma from '$features/database/prisma';
import { slugifyWithCheck } from '$lib/utils';

export async function GET({ request, locals }) {
	const session = await locals.auth();
	if (!session?.user?.id) {
		return new Response(null, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const text = searchParams.get('text');
	if (!text) {
		return new Response(null, { status: 400 });
	}

	const slug = await slugifyWithCheck(text, async (slug) => {
		const existingBento = await prisma.bento
			.findUnique({
				where: {
					slug_ownerId: {
						slug,
						ownerId: session?.user?.id || '',
					},
				},
			})
			.catch(() => null);

		const unique = !existingBento;
		return unique;
	});
	return new Response(JSON.stringify({ slug }));
}
