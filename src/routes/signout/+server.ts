import { signOut } from '$features/auth/auth';

export const GET = async (event) => {
	await signOut(event);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/',
		},
	});
};
