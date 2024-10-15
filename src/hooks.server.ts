import prisma from '$lib/prisma';
import { redirect, type Handle } from '@sveltejs/kit';
import { handle as authenticationHandle } from '$lib/auth';
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

	// event.request = new Request(event.url, {
	// 	method: event.request.method,
	// 	headers: event.request.headers,
	// 	body: event.request.body,
	// 	referrer: event.request.referrer,
	// 	referrerPolicy: event.request.referrerPolicy,
	// 	mode: event.request.mode,
	// 	credentials: event.request.credentials,
	// 	cache: event.request.cache,
	// 	redirect: event.request.redirect,
	// 	integrity: event.request.integrity,
	// });

	return resolve(event);
};

export const handle: Handle = sequence(
	protocolFixupHandle,
	authenticationHandle,
	authorizationHandle
);
