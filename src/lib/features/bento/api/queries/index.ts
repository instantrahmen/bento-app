import type { APIGetBentosResponse, APIQueryOptions } from '../../types/api';

export const getBentos = async ({
	fetch = globalThis.fetch,
}: APIQueryOptions): Promise<APIGetBentosResponse> => {
	try {
		const res = (await fetch('/api/bentos').then((r) => r.json())) as Promise<APIGetBentosResponse>;
		return res;
	} catch (error) {
		throw error;
	}
};
