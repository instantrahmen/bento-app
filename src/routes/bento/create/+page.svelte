<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import Icon from '@iconify/svelte';
	import { formSchema, fieldDescriptions } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils/shadcn';
	import type { IconifyIcon } from '@iconify/svelte/dist/OfflineIcon.svelte';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
	});

	type FormData = Infer<typeof formSchema>;
	type FormName = keyof FormData;

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="mx-4 flex flex-col gap-4">
	{@render formFieldInput('title')}
	<span class="flex flex-row items-center gap-2">
		{@render formFieldInput('icon')}
	</span>
	{@render formFieldTextArea('description')}
	<Form.Button>Create new Bento Box</Form.Button>
</form>

{#snippet formFieldInput(name: FormName)}
	<Form.Field {form} {name}>
		<Form.Control let:attrs>
			<Form.Label class="capitalize">{name}</Form.Label>
			<span class="flex flex-row items-center gap-2">
				{#if name === 'icon'}
					<span
						class={cn(
							buttonVariants({ variant: 'ghost', size: 'icon' }),
							'rounded-lg border px-2',
							'icon-preview'
						)}
					>
						<Icon icon={$formData[name] || ''} class="h-6 w-6" />
					</span>
				{/if}
				<Input {...attrs} bind:value={$formData[name]} />
			</span>
		</Form.Control>
		{#if name in fieldDescriptions && fieldDescriptions[name]}
			<Form.Description>{fieldDescriptions[name]}</Form.Description>
		{/if}
		<Form.FieldErrors />
	</Form.Field>
{/snippet}

{#snippet formFieldTextArea(name: FormName)}
	<Form.Field {form} {name}>
		<Form.Control let:attrs>
			<Form.Label class="capitalize">{name}</Form.Label>
			<Textarea {...attrs} bind:value={$formData[name] as string} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
{/snippet}

<style>
	.icon-preview:empty:after {
		content: '?';
	}
</style>
