<script lang="ts">
	import { PenIcon, SaveIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	interface EditableFieldProps {
		label: string;
		value?: string;
		editing?: boolean;
		onSave?: (value: string) => void;
		validate?: (value: string) => { valid: boolean; message: string };
		onError?: (message: string) => void;
		buttonType?: 'submit' | 'button';
		errorMessage?: string;
	}
	let {
		editing = $bindable(false),
		label,
		value = $bindable(''),
		errorMessage = $bindable(''),
		onSave,
		validate,
		onError,
		buttonType = 'button',
	}: EditableFieldProps = $props();

	let handleClick = () => {
		if (!editing) {
			editing = true;
		} else {
			handleSave(value);
		}
	};

	const handleSave = (val: string) => {
		if (!validate) {
			editing = false;
			return onSave?.(value);
		}

		let validated = validate(val);

		if (validated.valid) {
			editing = false;
			onSave?.(val);
		} else {
			errorMessage = validated.message;
			onError?.(validated.message);
		}
	};
</script>

<form class="space-y-2">
	<div class="flex gap-0">
		<Label
			class="flex items-center justify-center rounded-l-md border border-r-0 bg-muted/45 px-3 text-center"
			>{label}</Label
		>
		<Input
			bind:value
			readonly={!editing}
			tabindex={editing ? 0 : -1}
			class={`rounded-none ${editing ? 'border-primary' : 'border-x-0 bg-muted  text-muted-foreground'}`}
		/>
		<Button
			type={editing ? buttonType : 'button'}
			variant={editing ? 'default' : 'outline'}
			class="rounded-l-none"
			on:click={handleClick}
		>
			{#if editing}
				<SaveIcon class="h-4 w-4" />
			{:else}
				<PenIcon class="h-4 w-4" />
			{/if}
			<span class="sr-only">{editing ? `Save ${label}` : `Edit ${label}`}</span>
		</Button>
	</div>
	{#if errorMessage}
		<span class="text-sm text-destructive">{errorMessage}</span>
	{/if}
</form>
