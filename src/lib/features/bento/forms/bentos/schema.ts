import { z } from 'zod';

export const formSchema = z.object({
	title: z.string().min(3).max(50),
	slug: z
		.string()
		.min(2)
		.max(50)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
		.optional(),
	description: z.string().min(0).max(100).default(''),
	icon: z.string(),
});

type FormShape = typeof formSchema.shape;

export const fieldDescriptions: Record<keyof FormShape, string | undefined> = {
	icon: 'An iconify icon or a url to an image',
	slug: 'Where the bento will be accessed from. Ex: /bento/my-links-1234',
	description: 'A short description of what is in the bento',
	title: 'The title of the bento',
};

export type FormSchema = typeof formSchema;
