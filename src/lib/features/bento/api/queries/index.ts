import type {
	APIGetBentosResponse,
	APIGetBentoResponse,
	APIGetBentoOptions,
	APIGetBentosOptions,
	APIGetBentoLinkResponse,
	APIGetBentoLinkOptions,
} from '../../types/api';

export const getBentos = async ({
	fetch = globalThis.fetch,
}: APIGetBentosOptions): Promise<APIGetBentosResponse> => {
	const res: APIGetBentosResponse = await fetch('/api/bentos').then((r) => r.json());
	return res;
};

export const getBento = async ({
	fetch = globalThis.fetch,
	slug,
}: APIGetBentoOptions): Promise<APIGetBentoResponse> => {
	if (!slug.trim()) {
		throw new Error('slug is required');
	}
	const res: APIGetBentoResponse = await fetch(`/api/bentos/${slug}`).then((r) => r.json());
	return res;
};

export const getBentoLink = async ({
	fetch = globalThis.fetch,
	id,
	bentoSlug,
}: APIGetBentoLinkOptions): Promise<APIGetBentoLinkResponse | null> => {
	if (!id?.trim()) {
		return null;
	}
	const res: APIGetBentoLinkResponse = await fetch(`/api/bentos/${bentoSlug}/${id}`).then((r) =>
		r.json()
	);
	return res;
};
