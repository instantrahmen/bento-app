import type { UserSettings } from '@prisma/client';
import { json } from '@sveltejs/kit';
import prisma from '$features/database/prisma';

export const GET = async ({ locals }) => {
	const session = await locals.auth();

	// Get or create user settings
	const settings = await prisma.userSettings
		.findUnique({
			where: {
				userId: session?.user?.id,
			},
		})
		.then(async (res) => {
			if (!res) {
				const settings = await prisma.userSettings.create({
					data: {
						user: {
							connect: {
								id: session?.user?.id,
							},
						},
					},
				});
				return settings;
			}

			return res;
		})
		.catch((e) => {
			return null;
		});

	if (!settings) {
		return json(settings, { status: 404 });
	}

	return json(settings);
};

export const PUT = async ({ locals, request }) => {
	const session = await locals.auth();
	const { openLinksInNewTab }: Partial<UserSettings> = await request.json();

	if (!session?.user?.id) {
		throw new Response(null, { status: 401 });
	}

	const updatedSettings = await prisma.userSettings.update({
		where: {
			userId: session.user.id,
		},
		data: {
			openLinksInNewTab,
		},
	});

	return json({
		settings: updatedSettings,
	});
};
