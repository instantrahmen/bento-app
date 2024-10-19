<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import type { ComponentProps } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FormPath, SuperForm } from 'sveltekit-superforms';
	import * as FormPrimitive from 'formsnap';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';

	type FieldProps = FormPrimitive.FieldProps<T, U> & HTMLAttributes<HTMLElement>;
	// type FieldTypes = Omit<ComponentProps<typeof Form.Field>, 'form'>;
	let {
		form,
		value = $bindable(''),
		description,
		...restProps
	}: FieldProps & {
		name: U;
		form: SuperForm<T>;
		value?: string;
		description?: string;
	} = $props();
</script>

<Form.Field {form} {...restProps}>
	<Form.Control let:attrs>
		<Form.Label for={attrs.id} class="capitalize">{restProps.name}</Form.Label>
		{#if description}<Form.Description class="mt-0">{description}</Form.Description>{/if}

		<Input {...attrs} bind:value />
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>
