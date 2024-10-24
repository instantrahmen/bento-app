<script lang="ts" module>
	import type { BentoLink } from '@prisma/client';

	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { formSchema } from './schema';

	export type Props = {
		/** The slug of the bento to be edited. If not provided, a new bento will be created. */
		id?: string;
		bentoSlug: string;
		initialData?: BentoLink;
	};
</script>

<script lang="ts">
	import type { APIGetUsersMeResponse } from '$features/auth/types';
	import type { CreateBentoLinkOptions, UpdateBentoLinkOptions } from '$features/bento/types/api';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	import { page } from '$app/stores';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import * as Form from '$lib/components/ui/form';
	import FormInput from '$lib/components/form/form-input.svelte';

	import { keys } from '$features/bento/api/keys';
	import { createBentoLink, updateBentoLink } from '$features/bento/api';
	import { IconSelect } from '$features/icon-select';
	import IconOrImage from '$lib/components/icon-or-image.svelte';
	import DebugState from '$lib/components/debug/debug-state.svelte';
	import { goto } from '$app/navigation';

	let { id, bentoSlug }: Props = $props();

	const client = useQueryClient();

	let user = $derived($page.data.user) as APIGetUsersMeResponse['user'];
	let initialData = $derived(
		user?.bentos.find((bento) => bento.slug === bentoSlug)?.links.find((link) => link.id === id)
	);

	let bentoLink = createQuery(
		toReadable(() => ({ ...keys.bentoLink({ bentoSlug, id }), initialData }))
	);

	let initData = $derived($bentoLink.data);

	let initialize = () => {
		if (initData) return defaults(initData, zod(formSchema));
		return defaults(zod(formSchema));
	};

	const createBentoLinkMutation = createMutation({
		mutationFn: (options: CreateBentoLinkOptions) => createBentoLink(options),
		onSuccess: ({ id }) => {
			client.invalidateQueries({ queryKey: ['bentos'] });
			client.invalidateQueries({ queryKey: ['bentos', { slug: bentoSlug }] });
			client.invalidateQueries({ queryKey: ['bentos', 'bentoLink', { slug: bentoSlug, id }] });

			goto(`/bento/${bentoSlug}`);
		},
	});

	const updateBentoLinkMutation = createMutation({
		mutationFn: (options: UpdateBentoLinkOptions) => updateBentoLink(options),
		onSuccess: ({ id }) => {
			client.invalidateQueries({ queryKey: ['bentos'] });
			client.invalidateQueries({ queryKey: ['bentos', { slug: bentoSlug }] });
			client.invalidateQueries({ queryKey: ['bentos', 'bentoLink', { slug: bentoSlug, id }] });

			goto(`/bento/${bentoSlug}`);
		},
	});

	const form = superForm(initialize(), {
		SPA: true,
		validators: zod(formSchema),
		onUpdate({ form }) {
			if (form.valid) {
				if (initData?.id) {
					$updateBentoLinkMutation.mutate({
						bentoSlug,
						id: initData.id,
						body: form.data,
					});
				} else {
					$createBentoLinkMutation.mutate({
						bentoSlug,
						body: form.data,
					});
				}
			} else {
				console.log('invalid', {
					form,
				});

				$createBentoLinkMutation.reset();
				$updateBentoLinkMutation.reset();
			}
		},
		dataType: 'json',
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<header class="flex w-full flex-col items-center text-center">
		{#if $formData?.icon}
			<IconOrImage src={$formData.icon} alt="Bento main icon: {$formData.icon}" />
		{/if}
		{#if initData}
			<h2 class="text-3xl font-extralight text-muted-foreground">
				Editing
				<span class="font-semibold text-foreground">
					{initData.title}
				</span>
			</h2>
			<!-- <div class="text-left">
				<DebugState state={{ initialData, initData }} />
			</div> -->
		{:else}
			<h2 class="text-3xl font-extralight text-muted-foreground">New Bento</h2>
		{/if}
	</header>
	<FormInput
		bind:value={$formData.title}
		{form}
		name="title"
		description={formSchema.shape.title.description}
	/>
	<FormInput
		bind:value={$formData.description}
		{form}
		name="description"
		description={formSchema.shape.description.description}
	/>
	<FormInput
		bind:value={$formData.url}
		{form}
		name="url"
		description={formSchema.shape.url.description}
	/>
	<Form.Field {form} name="icon">
		<Form.Control let:attrs>
			<Form.Label class="capitalize">Icon</Form.Label>
			<Form.Description>{formSchema.shape.icon.description}</Form.Description>

			<IconSelect class="w-full" bind:value={$formData.icon} {...attrs} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>{initData ? 'Save Changes' : 'Create Link'}</Form.Button>
</form>
