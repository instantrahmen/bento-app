import type {
	APIGetBentosResponse,
	APIGetBentoResponse,
	APIGetBentoOptions,
	APIGetBentosOptions,
} from '../../types/api';

export const getBentos = async ({
	fetch = globalThis.fetch,
}: APIGetBentosOptions): Promise<APIGetBentosResponse> => {
	try {
		const res: APIGetBentosResponse = await fetch('/api/bentos').then((r) => r.json());
		return res;
	} catch (error) {
		throw error;
	}
};

export const getBento = async ({
	fetch = globalThis.fetch,
	slug,
}: APIGetBentoOptions): Promise<APIGetBentoResponse> => {
	if (!slug.trim()) {
		throw new Error('slug is required');
	}
	try {
		const res: APIGetBentoResponse = await fetch(`/api/bentos/${slug}`).then((r) => r.json());
		return res;
	} catch (error) {
		throw error;
	}
};
