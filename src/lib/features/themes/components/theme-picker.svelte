<script lang="ts">
	import type { Selected } from 'bits-ui';
	import { setTheme, theme } from 'mode-watcher';
	import { Palette } from 'lucide-svelte';
	import { themes } from '../config';
	import { cn } from '$lib/utils';
	import * as Select from '$lib/components/ui/select';

	let { class: className = '' }: { class?: string } = $props();

	let value: Selected<string> = $state(themes.find((t) => t.value === $theme) ?? themes[0]);

	$effect(() => {
		setTheme(value.value);
	});
</script>

<Select.Root items={themes} bind:selected={value}>
	<Select.Trigger class={cn('w-[180px]', className)}>
		<Palette class="mr-[9px] size-6 text-muted-foreground" />
		<Select.Value placeholder="Select a theme..." />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label class="text-muted-foreground">Themes</Select.Label>
			{#each themes as theme}
				<Select.Item value={theme.value} label={theme.label}>{theme.label}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
	<Select.Input name="theme" id="theme" />
</Select.Root>
