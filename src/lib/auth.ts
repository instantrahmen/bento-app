import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import Discord from '@auth/sveltekit/providers/discord';
import { DISCORD_ID, DISCORD_SECRET } from '$env/static/private';

import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '$lib/prisma';

export const providers = [
	'discord',
	//  'github'
];

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Discord({ clientId: DISCORD_ID, clientSecret: DISCORD_SECRET }),
		// GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
	],
});
