<script lang="ts" module>
	import type { APIGetUsersMeResponse } from '$features/auth/types';
	import type { APIPostBentosBody } from '$features/bento/types/api';

	import { formSchema } from './schema';
	import { superForm, defaults, setError } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	export type Props = {
		/** The slug of the bento to be edited. If not provided, a new bento will be created. */
		slug?: string;
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	import { untrack } from 'svelte';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Tabs from '$lib/components/ui/tabs';
	import FormInput from '$lib/components/form/form-input.svelte';

	import { keys } from '$features/bento/api/keys';
	import { createBento, updateBento } from '$features/bento/api';
	import { IconSelect } from '$features/icon-select';
	import IconOrImage from '$lib/components/icon-or-image.svelte';
	import { stringIsValidUrl } from '$lib/utils';
	import DebugState from '$lib/components/debug/debug-state.svelte';

	let { slug }: Props = $props();

	const client = useQueryClient();

	let user = $derived($page.data.user) as APIGetUsersMeResponse['user'];
	let initialData = $derived(user?.bentos.find((bento) => bento.slug === slug));

	let bento = createQuery(toReadable(() => ({ ...keys.bento({ slug: slug || '' }), initialData })));
	let initData = $derived($bento.data);

	let initialize = () => {
		if (initData) return defaults(initData, zod(formSchema));
		return defaults(zod(formSchema));
	};

	const createBentoMutation = createMutation({
		mutationFn: (bento: APIPostBentosBody) => createBento({ body: bento }).then(() => bento),
		onSuccess: () => client.invalidateQueries({ queryKey: ['bentos'] }),
	});

	const updateBentoMutation = createMutation({
		mutationFn: (bento: APIPostBentosBody) => updateBento({ body: bento }).then(() => bento),
		onSettled: () => client.invalidateQueries({ queryKey: ['bentos'] }),
	});

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
	const form = superForm(initialize(), {
		SPA: true,
		validators: zod(formSchema),
		onUpdate({ form }) {
			if (form.valid) {
				if (slug && initData?.id) {
					$updateBentoMutation.mutate({
						slug,
						...form.data,
					});
				} else {
					const newSlug = slugify(form.data.title);
					$createBentoMutation.mutate({
						...form.data,
						slug: form.data.slug || newSlug,
					});
				}
			} else {
				console.log('invalid', {
					form,
				});
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

	let tempIconImageState = $state({
		icon: '',
		image: '',
	});
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
			<div class="text-left">
				<DebugState state={{ initialData, initData }} />
			</div>
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
	<Form.Field {form} name="icon">
		<Form.Control let:attrs>
			<Form.Label class="capitalize">{imageMode}</Form.Label>
			<Form.Description>{formSchema.shape.icon.description}</Form.Description>

			<Tabs.Root bind:value={imageMode} class="w-[400px]">
				<Tabs.List class="grid w-full grid-cols-2">
					<Tabs.Trigger value="icon">Icon</Tabs.Trigger>
					<Tabs.Trigger value="image">Image</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="icon">
					<IconSelect class="w-full" bind:value={$formData.icon} {...attrs} />
				</Tabs.Content>
				<Tabs.Content value="image">
					<Input
						class="w-full"
						placeholder="Enter image url"
						bind:value={$formData.icon}
						{...attrs}
					/>
				</Tabs.Content>
			</Tabs.Root>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Save</Form.Button>
</form>

<DebugState
	state={{
		formData: $formData,
	}}
/>
<!--
<script lang="ts">
	import { untrack } from 'svelte';
	import { page } from '$app/stores';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';


	import { keys } from '$features/bento/api/keys';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import { createBento, updateBento } from '$features/bento/api';

	let client = $derived(useQueryClient());
  let data: SuperValidated<Infer<FormSchema>> = $state({});

	let { slug }: Props = $props();
	let user = $derived($page.data.user) as APIGetUsersMeResponse['user'];
	let initialData = $derived(user?.bentos.find((bento) => bento.slug === slug));

	let bento = createQuery(toReadable(() => ({ ...keys.bento({ slug: slug || '' }), initialData })));

	const createBentoMutation = createMutation({
		mutationFn: (bento: APIPostBentosBody) => createBento({ body: bento }).then(() => bento),
		onSuccess: () => client.invalidateQueries({ queryKey: ['bentos'] }),
	});

	const updateBentoMutation = createMutation({
		mutationFn: (bento: APIPostBentosBody) => updateBento({ body: bento }).then(() => bento),
		onSettled: () => client.invalidateQueries({ queryKey: ['bentos'] }),
	});

	let bentoLocalState = $state(untrack(() => ({ ...initialData })));

	$effect(() => {
		if (!$bento.isLoading && !$bento.isError && $bento.data) {
			console.log('data changed', $bento.data);
			bentoLocalState = $bento.data;
		}
	});
</script>
-->
