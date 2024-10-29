import { SvelteKitAuth } from '@auth/sveltekit';
// import GitHub from '@auth/sveltekit/providers/github';
import Discord from '@auth/sveltekit/providers/discord';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { DISCORD_ID, DISCORD_SECRET } from '$env/static/private';

const { MODE } = import.meta.env;

import prisma from '$features/database/prisma';

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
	trustHost: true,

	callbacks: {
		session({ session, user }) {
			session.user.id = user.id;
			return session;
		},
	},
});
