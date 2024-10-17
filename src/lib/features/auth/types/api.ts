import { Prisma } from '@prisma/client';
import type { Session } from '@auth/sveltekit';

const user = Prisma.validator<Prisma.UserDefaultArgs>()({
	include: {
		bentos: {
			include: {
				links: true,
			},
		},
	},
});

type User = Prisma.UserGetPayload<typeof user>;

export type APIGetUsersMeResponse = {
	user: User | null;
	session: Session | null;
};
