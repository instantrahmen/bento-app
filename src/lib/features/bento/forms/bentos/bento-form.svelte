<script lang="ts" module>
	import type { APIGetUsersMeResponse } from '$features/auth/types';
	import type { APIPostBentosBody } from '$features/bento/types/api';

	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { formSchema } from './schema';

	export type Props = {
		slug?: string;
	};
</script>

<script lang="ts">
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	import { untrack } from 'svelte';
	import { Trash2, Save } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import * as Form from '$lib/components/ui/form';
	import FormInput from '$lib/components/form/form-input.svelte';

	import { queries } from '$features/bento/api/queries';
	import { createBento, updateBento } from '$features/bento/api';
	import { IconSelect } from '$features/icon-select';
	import IconOrImage from '$lib/components/icon-or-image.svelte';
	import { slugify, stringIsValidUrl } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	let { slug }: Props = $props();

	const client = useQueryClient();
	let submitted = $state(false);

	let user = $derived($page.data.user) as APIGetUsersMeResponse['user'];
	let initialData = $derived(user?.bentos.find((bento) => bento.slug === slug));

	let bento = createQuery(
		toReadable(() => ({ ...queries.bento({ slug: slug }), initialData, retry: 0 }))
	);
	let initData = $derived($bento.data);

	let initialize = () => {
		if (initData) return defaults(initData, zod(formSchema));
		return defaults(zod(formSchema));
	};

	const createBentoMutation = createMutation({
		mutationFn: (bento: APIPostBentosBody) => createBento({ body: bento }),
		onSuccess: ({ slug }) => {
			client.invalidateQueries({ queryKey: ['bentos'] });
			client.invalidateQueries({ queryKey: ['bentos', { slug: slug }] });

			goto(`/bento/${slug}`);
		},
		onError: (error) => {
			submitted = false;
			formError = error.message;
		},
	});

	let formError: string | undefined = $state();

	const updateBentoMutation = createMutation({
		mutationFn: (bento: APIPostBentosBody) => updateBento({ body: bento }),
		onSettled: () => {
			client.invalidateQueries({ queryKey: ['bentos'] });
			client.invalidateQueries({ queryKey: ['bentos', { slug: slug }] });

			goto(`/bento/${slug}`);
		},
		onError: (error) => {
			submitted = false;
			formError = error.message;
		},
	});

	const deleteBentoMutation = createMutation({
		mutationFn: (slug: string) => fetch(`/api/bentos/${slug}`, { method: 'DELETE' }),
		onSettled: () => {
			client.invalidateQueries({ queryKey: ['bentos'] });
			client.invalidateQueries({ queryKey: ['bentos', { slug: slug }] });

			goto('/bento');
		},
		onError: (error) => {
			submitted = false;
			formError = error.message;
		},
	});

	const form = superForm(initialize(), {
		SPA: true,
		validators: zod(formSchema),
		async onUpdate({ form }) {
			if (form.valid) {
				submitted = true;
				if (slug && initData?.id) {
					$updateBentoMutation.mutate({
						slug,
						...form.data,
					});
				} else {
					const slugifyEndpoint = `/api/bentos/slugify?text=${form.data.title}`;
					const { slug: newSlug }: { slug: string } = await fetch(slugifyEndpoint.toString()).then(
						(r) => r.json()
					);
					$createBentoMutation.mutate({
						...form.data,
						slug: form.data.slug || newSlug,
					});
				}
			} else {
				submitted = false;
				$createBentoMutation.reset();
				$updateBentoMutation.reset();
			}
		},
		dataType: 'json',
	});

	const { form: formData, enhance } = form;

	let imageMode = $state(
		untrack(() => {
			if (!initData) return 'icon';
			return stringIsValidUrl(initData.icon) ? 'image' : 'icon';
		})
	);
</script>

{submitted}
{#if (slug && ($bento.isLoading || $bento.isFetching)) || submitted}
	<div class=" p-6 text-center">
		<iconify-icon
			icon="mdi:loading"
			width="2em"
			height="2em"
			class="mx-auto aspect-square h-[2em] w-[2em] animate-spin text-[2em]"
		></iconify-icon>
	</div>
{:else}
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
			{:else}
				<h2 class="text-3xl font-extralight text-muted-foreground">New Bento</h2>
			{/if}
		</header>
		{#if formError}
			<p class="text-center text-sm text-destructive">{formError}</p>
		{/if}
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
		<Form.Field {form} name="icon">
			<Form.Control let:attrs>
				<Form.Label class="capitalize">{imageMode}</Form.Label>
				<Form.Description>{formSchema.shape.icon.description}</Form.Description>
				<IconSelect class="w-full" bind:value={$formData.icon} {...attrs} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_2fr]">
			<Button
				on:click={() => goto(`/bento${slug ? `/${slug}` : ''}`)}
				variant="ghost"
				class="w-full bg-muted"
				size="lg">Cancel</Button
			>
			<Form.Button class="flex w-full gap-2" size="lg">
				<Save />
				{initData ? 'Save Changes' : 'Create Bento'}
			</Form.Button>

			{#if initData && slug}
				<span class="flex flex-row items-center sm:col-span-2">
					<hr class="w-full bg-muted" />
					<span class="mx-4 text-lg text-muted">OR</span>
					<hr class="w-full bg-muted" />
				</span>
				<AlertDialog.Root closeOnOutsideClick>
					<AlertDialog.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							variant="destructive"
							class="ml-auto flex w-full gap-2 sm:col-span-2"
						>
							<Trash2 />
							Delete Bento
						</Button>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Are you sure you want to delete this bento?</AlertDialog.Title>
							<AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action
								class="bg-destructive"
								onclick={() => $deleteBentoMutation.mutate(slug)}>Continue</AlertDialog.Action
							>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			{/if}
		</div>
	</form>
{/if}
