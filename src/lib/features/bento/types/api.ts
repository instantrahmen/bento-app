import type { APIQueryOptionsBase } from '$lib/types/api';
import { Prisma, type BentoLink } from '@prisma/client';

const _bentoWithLinks = Prisma.validator<Prisma.BentoDefaultArgs>()({
	include: {
		links: true,
	},
});

const _bento = Prisma.validator<Prisma.BentoGetPayload<typeof _bentoWithLinks>>()({});

export type BentoWithLinks = Prisma.BentoGetPayload<typeof _bentoWithLinks>;
export type Bento = Prisma.BentoGetPayload<typeof _bento>;

export type APIGetBentosResponse = BentoWithLinks[];
export type APIGetBentoResponse = BentoWithLinks;

export type APIPostBentosResponse = Bento;
export type APIPostBentosBody = Omit<Bento, 'id' | 'ownerId'>;

export type APIPutBentosResponse = Bento;
export type APIPutBentosBody = Pick<Bento, 'id'> & Partial<Bento>;

export type APIDeleteBentosResponse = Bento;
export type APIDeleteBentosBody = Pick<Bento, 'id'>;

export type APIGetBentosOptions = APIQueryOptionsBase;
export type APIGetBentoOptions = APIQueryOptionsBase & { slug: string };

export type APIGetBentoLinkOptions = APIQueryOptionsBase & {
	id?: string;
	bentoSlug: string;
};

export type APIGetBentoLinkResponse = BentoLink;

export type APIMutationOptions<T> = APIQueryOptionsBase & {
	body: T;
};

export type CreateBentoLinkOptions = APIMutationOptions<Omit<BentoLink, 'id' | 'bentoId'>> & {
	bentoSlug: string;
};

export type UpdateBentoLinkOptions = APIMutationOptions<Partial<BentoLink>> & {
	bentoSlug: string;
	id: string;
};
