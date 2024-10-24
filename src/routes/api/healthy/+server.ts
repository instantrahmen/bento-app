import { json } from '@sveltejs/kit';
import prisma from '$features/database/prisma';

export const GET = async () => {
	const app = await prisma.app.findFirst();

	return json({ healthy: true, info: app });
};
