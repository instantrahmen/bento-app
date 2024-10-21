import type { Bento } from '@prisma/client';
import type {
	APIPostBentosResponse,
	APIPostBentosBody,
	APIMutationOptions,
} from '$features/bento/types/api';

export const createBento = async ({
	fetch = globalThis.fetch,
	body,
}: APIMutationOptions<APIPostBentosBody>) => {
	const res = (await fetch('/api/bentos', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	}).then((r) => r.json())) as Promise<APIPostBentosResponse>;

	return res;
};

export const updateBento = async ({
	fetch = globalThis.fetch,
	body,
}: APIMutationOptions<Pick<Bento, 'slug'> & Partial<Bento>>) => {
	const res = (await fetch(`/api/bentos/${body.slug}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	}).then((r) => r.json())) as Promise<APIPostBentosResponse>;

	return res;
};
