import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { env } from '$env/dynamic/private';
import { handle as authenticationHandle } from '$features/auth/auth';

const authorizationHandle: Handle = async ({ event, resolve }) => {
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
