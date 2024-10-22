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
		.describe('The title of the link'),
	url: z
		.string()
		.url({ message: 'Must be a valid url' })
		.min(3, { message: 'Must be at least 3 characters' })
		.max(256, { message: 'May not be longer than 256 characters. Consider using a url shortener.' })
		.describe('The url of the link'),
	description: z
		.string()
		.min(0)
		.max(256, { message: 'May not be longer than 256 characters' })
		.default('')
		.describe('A short description of the link'),
	icon: z
		.string()
		.describe('An iconify icon or a url to an image')
		.min(3, { message: 'Must be at least 3 characters' })
		.regex(/^[a-zA-Z]+:[a-zA-Z0-9_-]+$/, {
			message: 'Must be a valid iconify icon or url',
		})
		.or(
			z.string().url({ message: 'Must be a valid url' }).min(3, { message: 'Must be a valid url' })
		),
});

export type FormSchema = typeof formSchema;
