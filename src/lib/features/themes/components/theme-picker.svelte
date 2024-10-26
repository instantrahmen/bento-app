<script lang="ts">
	import type { Selected } from 'bits-ui';
	import { setTheme, theme } from 'mode-watcher';
	import { Palette } from 'lucide-svelte';
	import { themes } from '../config';
	import { cn } from '$lib/utils';
	import * as Select from '$lib/components/ui/select';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	let { class: className = '', type = 'select' }: { class?: string; type?: 'select' | 'submenu' } =
		$props();

	let value: Selected<string> = $state(themes.find((t) => t.value === $theme) ?? themes[0]);

	$effect(() => {
		setTheme(value.value);
	});
</script>

{#if type === 'select'}
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
{:else}
	<DropdownMenu.Sub>
		<DropdownMenu.SubTrigger>Theme</DropdownMenu.SubTrigger>
		<DropdownMenu.SubContent>
			{#each themes as theme}
				<DropdownMenu.Item
					on:click={() => {
						value = theme;
					}}
					class={cn(value.value === theme.value && 'text-muted-foreground-foreground bg-muted')}
					>{theme.label}</DropdownMenu.Item
				>
			{/each}
			<!-- <DropdownMenu.Item>Email</DropdownMenu.Item>
		<DropdownMenu.Item>Message</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>More...</DropdownMenu.Item> -->
		</DropdownMenu.SubContent>
	</DropdownMenu.Sub>
{/if}
