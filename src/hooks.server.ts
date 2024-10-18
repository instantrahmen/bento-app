import prisma from '$features/database/prisma';
import { redirect, type Handle } from '@sveltejs/kit';
import { handle as authenticationHandle } from '$features/auth/auth';
import { sequence } from '@sveltejs/kit/hooks';
import { env } from '$env/dynamic/private';
import credentials from '@auth/sveltekit/providers/credentials';
import { mode } from 'mode-watcher';

const authorizationHandle: Handle = async ({ event, resolve }) => {
	// const session = await event.locals.auth();
	// const user = await prisma.user.findUnique({
	//   where: {
	//     email: session?.user?.email ?? undefined
	//   },
	//   include: {
	//     bentos: {
	//       include: {
	//         links: true
	//       }
	//     }
	//   }
	// })

	// event.locals.user = user;
	// event.locals.session = session;

	return resolve(event);
};

const protocolFixupHandle: Handle = async ({ event, resolve }) => {
	if (env.IS_HTTPS == '1') event.url = new URL(event.url.toString().replace(/^http:/, 'https:'));

	return resolve(event);
};

export const handle: Handle = sequence(
	protocolFixupHandle,
	authenticationHandle,
	authorizationHandle
);
