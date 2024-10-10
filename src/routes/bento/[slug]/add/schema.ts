import { z } from 'zod';

// Bento Link Form
export const formSchema = z.object({
	title: z.string().min(2).max(50),
	url: z.string().url().min(2).max(50),
	description: z.string().min(2).max(100).optional(),
	icon: z.string().optional(),
	image: z.string().url().optional(),
});

type FormShape = typeof formSchema.shape;

export type FormSchema = typeof formSchema;
