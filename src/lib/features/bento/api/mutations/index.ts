import type { Bento, BentoLink } from '@prisma/client';
import type {
	APIPostBentosResponse,
	APIPostBentosBody,
	APIMutationOptions,
	CreateBentoLinkOptions,
	UpdateBentoLinkOptions,
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

export const createBentoLink = async ({
	fetch = globalThis.fetch,
	bentoSlug,
	body,
}: CreateBentoLinkOptions) => {
	const res = (await fetch(`/api/bentos/${bentoSlug}/add`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	}).then((r) => r.json())) as Promise<BentoLink>;

	return res;
};

export const updateBentoLink = async ({
	fetch = globalThis.fetch,
	id,
	bentoSlug,
	body,
}: UpdateBentoLinkOptions) => {
	const res = (await fetch(`/api/bentos/${bentoSlug}/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	}).then((r) => r.json())) as Promise<BentoLink>;

	return res;
};
