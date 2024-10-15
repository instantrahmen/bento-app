<script lang="ts">
	import Check from 'svelte-radix/Check.svelte';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import { tick, untrack, type Snippet } from 'svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils/shadcn';
	import { fuzzySearch } from '$lib/utils/fuzzy-search';
	import VirtualList from './virtual-list.svelte';
	import Icon from '@iconify/svelte';

	type IDs = {
		content: string;
		trigger: string;
	};

	interface Props {
		options: { label: string; value: string }[];
		value?: string | null;
		open?: boolean;
		placeholder?: string;
		emptyText?: string;
		class?: string;
		children?: Snippet<
			[
				{
					option: { label: string; value: string };
					selected: boolean;
					itemProps: {
						onSelect: (e: string) => void;
						value: string;
					};
				},
			]
		>;
		asChildren?: boolean;
		onSelect?: (value: string, ids: IDs) => void;
		searchInput?: string;
		autoFilterItems?: boolean;
		cols?: number;
		overscan?: number;
		name?: string;
	}

	let {
		options,
		value = $bindable(null),
		open = $bindable(false),
		class: className = $bindable(''),
		searchInput = $bindable(''),
		emptyText = 'No options found...',
		placeholder = 'Select an option...',
		children,
		asChildren = false,
		onSelect,
		autoFilterItems = false,
		cols = $bindable(4),
		overscan = $bindable(10),
		name = 'combobox',
	}: Props = $props();

	let selectedValue = $derived(options.find((f) => f.value === value)?.label ?? placeholder);

	let filteredOptions: { label: string; value: string }[] = $state(untrack(() => options));

	let rows = $derived(Math.ceil(filteredOptions.length / cols));

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	const handleSelect = (currentValue: string, ids: IDs) => {
		console.log('onSelect', currentValue);
		value = currentValue;
		closeAndFocusTrigger(ids.trigger);

		if (onSelect) {
			onSelect(currentValue, ids);
		}
	};

	$effect(() => {
		if (autoFilterItems) {
			filteredOptions = fuzzySearch(options, ['label', 'value'], searchInput);
		} else {
			filteredOptions = options;
		}
	});
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			size={'sm'}
			aria-expanded={open}
			class="flex w-min flex-row justify-between gap-2"
		>
			{#if value}
				<Icon icon={value} class="h-6 w-6" />
			{/if}
			{selectedValue}

			<CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input
				{placeholder}
				debounceTime={250}
				class="h-9"
				name="combobox-search-{name}"
				id="combobox-search-{name}"
				bind:debouncedValue={searchInput}
				onInput={(val: string) => {
					console.log({ val });
				}}
			/>
			<Command.Empty>{emptyText}</Command.Empty>
			<Command.Group asChild>
				<VirtualList
					{overscan}
					class={cn(className)}
					containerClass="command-group h-[200px] overflow-y-auto overflow-x-visible"
					count={rows}
					childrenClass="[&>*]:w-full w-full flex flex-col"
					let:row
				>
					{@const rowStart = row.index * cols}
					{@const rowEnd = Math.min(rowStart + cols, filteredOptions.length)}
					{@const rowItems = filteredOptions.slice(rowStart, rowEnd)}

					<div
						class="grid items-center justify-between"
						style="grid-template-columns: repeat({cols}, minmax(0, 1fr));"
					>
						{#each rowItems as option (option.value)}
							{@const selected = value === option.value}
							<Command.Item
								value={option.value}
								onSelect={(c) => handleSelect(c, ids)}
								asChild={!!children && asChildren}
							>
								{#if !children}
									{#if selected}
										<Check class={cn('mr-2 h-4 w-4')} />
									{:else}
										<span class={cn('mr-2 h-4 w-4')}></span>
									{/if}
									{option.label}
								{:else}
									{@render children({
										option,
										selected,
										itemProps: {
											onSelect: (c) => handleSelect(c, ids),
											value: option.value,
										},
									})}
								{/if}
							</Command.Item>
						{/each}
					</div>
				</VirtualList>
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
