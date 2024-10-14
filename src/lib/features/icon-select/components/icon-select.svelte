<script lang="ts">
	import ComboBox from '$lib/components/combo-box.svelte';
	import * as Command from '$lib/components/ui/command';
	import { cn } from '$lib/utils/shadcn';
	import { Check, Box } from 'svelte-radix';
	import Icon from '@iconify/svelte';

	const testIcons = $state([
		{
			label: 'Mdi Home',
			value: 'mdi:home',
		},
		{
			label: 'Mdi Account',
			value: 'mdi:account',
		},
		{
			label: 'Mdi Cog',
			value: 'mdi:cog',
		},
		{
			label: 'Mdi Plus',
			value: 'mdi:plus',
		},
		{
			label: 'Mdi Minus',
			value: 'mdi:minus',
		},
		{
			label: 'Mdi Check',
			value: 'mdi:check',
		},
		{
			label: 'Mdi Close',
			value: 'mdi:close',
		},
		{
			label: 'Tabler Trash',
			value: 'tabler:trash',
		},
	]);
</script>

<ComboBox
	asChildren
	placeholder="Select an icon..."
	options={[...testIcons]}
	class="combobox-container"
	autoFilterItems
>
	{#snippet children({ selected, option, itemProps })}
		<Command.Item
			class={cn('flex flex-row items-center justify-center text-center transition-all')}
			{...itemProps}
		>
			<Icon icon={option.value} class="inline h-6 w-6" />
		</Command.Item>
	{/snippet}
</ComboBox>

<style lang="postcss">
	/* [&_[data-cmdk-group-items]]:grid [&_[data-cmdk-group-items]]:grid-cols-2 */

	:global(.combobox-container div[role='group']) {
		@apply m-0 grid gap-2 p-0 text-center;
		grid-template-columns: repeat(auto-fill, minmax(3rem, 1fr));
	}
</style>
