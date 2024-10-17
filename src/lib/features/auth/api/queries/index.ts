import { type APIGetUsersMeResponse } from '$features/auth/types';
import type { APIQueryOptionsBase } from '$lib/types/api';

export const getMe = async ({
	fetch = globalThis.fetch,
}: APIQueryOptionsBase): Promise<APIGetUsersMeResponse> => {
	try {
		const res = (await fetch('/api/users/me').then((r) =>
			r.json()
		)) as Promise<APIGetUsersMeResponse>;
		return res;
	} catch (error) {
		throw error;
	}
};
