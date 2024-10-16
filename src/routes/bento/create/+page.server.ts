import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import prisma from '$features/database/prisma.js';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema)),
	};
};

const slugify = (text: string) => {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
};

export const actions: Actions = {
	default: async (event) => {
		const session = await event.locals.auth();
		if (!session || !session.user || !session.user.email) {
			throw redirect(303, '/');
		}

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			// console.log('failed', form);
			return fail(400, {
				form,
			});
		}

		const slug = slugify(form.data.slug || form.data.title);

		try {
			await prisma.bento.create({
				data: {
					...form.data,
					slug,
					owner: {
						connect: {
							email: session.user.email,
						},
					},
				},
			});

			console.log('success');

			return {
				form,
			};
		} catch (error) {
			console.log('error', error);
			return {
				form,
			};
		}
	},
};
