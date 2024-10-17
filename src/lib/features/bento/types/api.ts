import type { APIQueryOptionsBase } from '$lib/types/api';
import { Prisma } from '@prisma/client';

const bentoWithLinks = Prisma.validator<Prisma.BentoDefaultArgs>()({
	include: {
		links: true,
	},
});

const bento = Prisma.validator<Prisma.BentoGetPayload<typeof bentoWithLinks>>()({});

export type BentoWithLinks = Prisma.BentoGetPayload<typeof bentoWithLinks>;
export type Bento = Prisma.BentoGetPayload<typeof bento>;

export type APIGetBentosResponse = BentoWithLinks[];
export type APIGetBentoResponse = BentoWithLinks;
export type APIPostBentosResponse = Bento;
export type APIPostBentosBody = Pick<Bento, 'title' | 'slug' | 'icon'>;

export type APIPutBentosResponse = Bento;
export type APIPutBentosBody = Pick<Bento, 'id'> & Partial<Pick<Bento, 'title' | 'slug' | 'icon'>>;
export type APIDeleteBentosResponse = Bento;
export type APIDeleteBentosBody = Pick<Bento, 'id'>;

export type APIGetBentosOptions = APIQueryOptionsBase;
export type APIGetBentoOptions = APIQueryOptionsBase & { slug: string };

export type APIMutationOptions<T> = APIQueryOptionsBase & {
	body: T;
};
