import prisma from '$lib/prisma';
import { redirect, type Handle } from '@sveltejs/kit';
import { handle as authenticationHandle } from '$lib/auth';
import { sequence } from '@sveltejs/kit/hooks';

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

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(authenticationHandle, authorizationHandle);
