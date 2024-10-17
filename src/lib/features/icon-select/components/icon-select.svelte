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
		value = $bindable(),
		name = 'icon',
	}: {
		iconSets?: string[];
		value?: string;
		name?: string;
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

	const getTooltip = (option: { label: string; value: string }) => {
		return 'test';
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

<pre class="prose-sm">
	<code>
{JSON.stringify(
			{
				hovering,
				lastActiveElement,
			},
			null,
			2
		)}
	</code>
</pre>

<Popover
	openDelay={0}
	closeDelay={300}
	open={tooltipOpen}
	class="popover rounded border bg-card p-2 shadow-lg">{lastActiveElement}</Popover
>

<ComboBox
	asChildren
	placeholder="Select an icon..."
	options={(currentItems || []).length > 0 ? currentItems : placeholderItem}
	class="combobox-container"
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
							'flex flex-row items-center justify-center text-center transition-all',
							'focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none',
							'tooltip-container'
						)}
						{...itemProps}
					>
						<Icon icon={option.value} class="inline h-6 w-6" />
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
		height: 4rem;
		bottom: 1rem;
		left: 1rem;

		transition: all 0.6s ease-in-out;
		&:popover-open {
			animation: slide-up 0.6s ease-in-out;
		}

		@keyframes slide-up {
			from {
				transform: translate(0, 4rem);
			}
			to {
				transform: translate(0, 0rem);
			}
		}

		/* margin: 0; */
		/* right: 0; */
		/* @apply m-0 grid gap-2 p-0 text-center; */
		/* grid-template-columns: repeat(4, 1fr); */
	}
</style>
