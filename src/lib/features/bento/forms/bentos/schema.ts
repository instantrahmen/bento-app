import { z } from 'zod';

export const formSchema = z.object({
	title: z
		.string()
		.min(3, {
			message: 'Title must be at least 3 characters',
		})
		.max(50, {
			message: 'Title may not be longer than 50 characters',
		})
		.describe('The title of the bento'),
	slug: z
		.string()
		.min(2, { message: 'Slug must be at least 2 characters' })
		.max(50, { message: 'Slug may not be longer than 50 characters' })
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
			message: 'Must be a valid slug',
		})
		.optional()
		.describe('Where the bento will be accessed from. Ex: /bento/my-links-1234'),
	description: z
		.string()
		.min(0)
		.max(100)
		.default('')
		.describe('A short description of what is in the bento'),
	icon: z
		.string()
		.describe('An iconify icon or a url to an image')
		.min(3, { message: 'Must be at least 3 characters' })
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
			message: 'Must be a valid iconify icon or a url to an image',
		}),
});

export type FormSchema = typeof formSchema;
