<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import Icon from '@iconify/svelte';

	import { cn } from '$lib/utils/shadcn';
	import ComboBox from '$lib/components/combo-box.svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Tooltip from '$lib/components/ui/tooltip';

	import { getCollections, getMultipleCollectionsIcons } from '../api/iconify';
	import { paginate } from '$lib/utils/paginate';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import { defaultIconsSets } from '../default-icons-sets';
	import { Button } from '$lib/components/ui/button';
	import Popover from '$lib/components/popover.svelte';

	let {
		iconSets = [...defaultIconsSets],
		value = $bindable(null),
		name = 'icon',
		class: className = '',
	}: {
		iconSets?: string[];
		value?: string | null;
		name?: string;
		class?: string;
	} = $props();

	const queryOptions = {
		queryKey: ['icons', iconSets],
		queryFn: async () => await getMultipleCollectionsIcons(iconSets),
	};

	const collectionInfoQueryOptions = {
		queryKey: ['collections'],
		queryFn: async () => await getCollections(),
	};

	const query = createQuery(toReadable(() => queryOptions));
	const collectionInfoQuery = createQuery(toReadable(() => collectionInfoQueryOptions));

	const placeholderItem = $derived(
		(() => {
			if ($query.isLoading) {
				return [{ label: 'Loading...', value: 'mdi:loading' }];
			}

			if ($query.isError) {
				return [{ label: 'Error', value: 'mdi:alert' }];
			}

			return [{ label: 'No icons found', value: 'mdi:alert' }];
		})()
	);

	let currentPage = $state(0);

	let paginatedItems = $derived(paginate($query.data ?? [], $query.data?.length ?? 0));

	let currentItems = $derived(paginatedItems[currentPage]);

	const getCollectionByIcon = (value: string) => {
		if ($collectionInfoQuery.isLoading || $collectionInfoQuery.isError) return null;
		const prefix = value.split(':')[0];
		let collection = $collectionInfoQuery.data?.[prefix];
		if (!collection) return null;
		return collection;
	};

	let tooltipText: string = $state('');

	let childrenElements: { [key: string]: HTMLElement } = {};

	let lastActiveElement: string = $state('');
	let hovering: boolean = $state(false);

	let tooltipOpen: boolean = $state(false);

	$effect(() => {
		tooltipOpen = hovering;
	});
</script>

<Popover
	closeDelay={10000}
	open={tooltipOpen}
	class="popover prose-sm rounded border bg-background py-2 pl-4 pr-2 shadow-lg"
>
	{@const collection = getCollectionByIcon(lastActiveElement)}
	{@const iconName = lastActiveElement.split(':')[1]}
	<div class="flex flex-row items-center justify-start gap-4">
		<Icon icon={lastActiveElement} class="h-8 w-8"></Icon>
		<div
			class="flex flex-1 flex-col items-start justify-center rounded border bg-card p-2 text-card-foreground"
		>
			<h3 class="m-0 p-0 font-semibold capitalize">{iconName}</h3>
			{#if collection}
				{@const { name, license, author } = collection}
				<span>From {name} v{collection.version} </span>
				<span
					>Licensed under <a href={license.url}>{license.title}</a> by
					<a href={author.url}>{author.name}</a></span
				>
			{/if}
		</div>
	</div>
</Popover>

<ComboBox
	asChildren
	placeholder="Select an icon..."
	options={(currentItems || []).length > 0 ? currentItems : placeholderItem}
	class="combobox-container"
	inputClass={cn(className)}
	autoFilterItems
	cols={4}
	overscan={5}
	bind:value
	{name}
>
	{#snippet children({ selected, option, itemProps })}
		{#if $query.isLoading}
			Loading
		{:else if $query.isError}
			Error
		{:else}
			{#key option.value}
				<div
					class="contents"
					onfocusin={() => {
						lastActiveElement = option.value;
						hovering = true;
					}}
					onfocusout={() => {
						hovering = false;
					}}
				>
					<Button
						onmouseenter={() => {
							lastActiveElement = option.value;
							hovering = true;
						}}
						onmouseleave={() => {
							hovering = false;
						}}
						variant="ghost"
						on:click={() => {
							value = option.value;
						}}
						class={cn(
							'flex flex-row items-center justify-center p-3 text-center transition-all',
							'focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none',
							'tooltip-container'
						)}
						{...itemProps}
					>
						<Icon icon={option.value} class=" inline h-8 w-8 text-center text-[2rem]"></Icon>
					</Button>
				</div>
			{/key}
		{/if}
	{/snippet}
</ComboBox>

<style lang="postcss">
	:global(.popover) {
		position: absolute;
		inset: unset;
		width: calc(100vw - 2rem);
		height: min-content;
		bottom: 1rem;
		left: 1rem;

		a {
			@apply text-primary underline;
		}
	}
</style>
