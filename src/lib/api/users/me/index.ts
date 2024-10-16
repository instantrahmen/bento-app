import { type APIGetUsersMeResponse } from '$features/auth/types';

export const getMe = async (fetch: typeof globalThis.fetch): Promise<APIGetUsersMeResponse> => {
	try {
		const res = (await fetch('/api/users/me').then((r) =>
			r.json()
		)) as Promise<APIGetUsersMeResponse>;
		return res;
	} catch (error) {
		throw error;
	}
};
