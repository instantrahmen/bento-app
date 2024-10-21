<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { Selected } from 'bits-ui';
	import { themes } from '../config';
	import { setTheme, theme } from 'mode-watcher';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	let { class: className = '' }: { class?: string } = $props();

	let value: Selected<string> = $state(themes.find((t) => t.value === $theme) ?? themes[0]);

	$effect(() => {
		setTheme(value.value);
	});
</script>

<Select.Root items={themes} bind:selected={value}>
	<Select.Trigger class={cn('w-[180px]', className)}>
		<Select.Value placeholder="Select a theme..." />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Themes</Select.Label>
			{#each themes as theme}
				<Select.Item value={theme.value} label={theme.label}>{theme.label}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
	<Select.Input name="theme" id="theme" />
</Select.Root>
