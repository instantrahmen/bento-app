import type { APIPostBentosResponse, APIPostBentosBody, APIMutationOptions } from '../../types/api';

export const createBento = async ({
	fetch = globalThis.fetch,
	body,
}: APIMutationOptions<APIPostBentosBody>) => {
	try {
		const res = (await fetch('/api/bentos', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then((r) => r.json())) as Promise<APIPostBentosResponse>;

		return res;
	} catch (error) {
		throw error;
	}
};

export const updateBento = async ({
	fetch = globalThis.fetch,
	body,
}: APIMutationOptions<APIPostBentosBody>) => {
	try {
		const res = (await fetch('/api/bentos', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then((r) => r.json())) as Promise<APIPostBentosResponse>;

		return res;
	} catch (error) {
		throw error;
	}
};
