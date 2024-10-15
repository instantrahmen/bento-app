<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import Icon from '@iconify/svelte';

	import { cn } from '$lib/utils/shadcn';
	import ComboBox from '$lib/components/combo-box.svelte';
	import * as Command from '$lib/components/ui/command';

	import { getCollectionIcons } from '../api/iconify';
	import { paginate } from '$lib/utils/paginate';
	import { browser } from '$app/environment';

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
	]);

	const query = createQuery({
		queryKey: ['iconify', 'collection', 'mdi'],
		queryFn: async () => await getCollectionIcons('mdi'),
	});

	const placeholderItem = $derived(
		(() => {
			if ($query.isLoading) {
				return [{ label: 'Loading...', value: 'mdi:loading' }];
			}

			if ($query.isError) {
				return [{ label: 'Error', value: 'mdi:alert' }];
			}

			return [testIcons[0]];
		})()
	);

	let currentPage = $state(0);

	let paginatedItems = $derived(paginate($query.data ?? [], $query.data?.length ?? 0));

	let currentItems = $derived(paginatedItems[currentPage]);
</script>

<!-- {JSON.stringify(currentItems, null, 2)} -->
<ComboBox
	asChildren
	placeholder="Select an icon..."
	options={(currentItems || []).length > 0 ? currentItems : placeholderItem}
	class="combobox-container"
	autoFilterItems
	cols={4}
	overscan={5}
>
	{#snippet children({ selected, option, itemProps })}
		{#if $query.isLoading}
			Loading
		{:else if $query.isError}
			Error
		{:else}
			<Command.Item
				class={cn('flex flex-row items-center justify-center text-center transition-all')}
				{...itemProps}
			>
				<Icon icon={option.value} class="inline h-6 w-6" />
			</Command.Item>
		{/if}
	{/snippet}
</ComboBox>

<style lang="postcss">
	/* [&_[data-cmdk-group-items]]:grid [&_[data-cmdk-group-items]]:grid-cols-2 */

	:global(.combobox-container) {
		/* @apply m-0 grid gap-2 p-0 text-center; */
		/* grid-template-columns: repeat(4, 1fr); */
	}
</style>
