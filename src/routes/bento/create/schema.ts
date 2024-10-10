import { z } from 'zod';
import { formSchema as linkSchema } from '../[slug]/add/schema';

export const formSchema = z.object({
	title: z.string().min(2).max(50),
	slug: z
		.string()
		.min(2)
		.max(50)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
		.optional(),
	description: z.string().min(2).max(100).optional(),
	icon: z.string().optional(),
	image: z.string().url().optional(),

	// links: linkSchema.array().optional(),
});

type FormShape = typeof formSchema.shape;

export const fieldDescriptions: Record<keyof FormShape, string | undefined> = {
	icon: 'An iconify icon name (https://icon-sets.iconify.design/)',
	slug: undefined,
	description: undefined,
	image: undefined,
	title: undefined,
	// links: 'Add links to your bento box',
};

export type FormSchema = typeof formSchema;
