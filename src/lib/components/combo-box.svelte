<!-- 
const mockApiSearch = (searchQuery: string): string[] => {
  const lookingForCats = searchQuery.includes("cat")
  const lookingForDogs = searchQuery.includes("dog")
  if (lookingForCats && lookingForDogs) {
    return [...cats, ...dogs]
  } else if (lookingForCats) {
    return cats
  } else if (lookingForDogs) {
    return dogs
  } else {
    return []
  }
}

export default function CommandCustomFiltering() {
  const [commandInput, setCommandInput] = React.useState<string>("")
  const [results, setResults] = React.useState<string[]>([])
  React.useEffect(() => {
    setResults(mockApiSearch(commandInput))
  }, [commandInput])

  return (
    <Command className="rounded-lg border shadow-md" shouldFilter={false}>
      <CommandInput placeholder="Type 'cat' or 'dog'..." value={commandInput} onValueChange={setCommandInput} />
      <CommandList>
        <CommandEmpty>{ commandInput === "" ? "Start typing to load results": "No results found." }</CommandEmpty>
        <CommandGroup>
          {
            results.map((result: string) => <CommandItem key={result} value={result}>
              { result }
            </CommandItem>)
          }
        </CommandGroup>
      </CommandList>
    </Command>
  )
} -->

<script lang="ts">
	import Check from 'svelte-radix/Check.svelte';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import { tick, untrack, type Snippet } from 'svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils/shadcn';
	import Input from './ui/input/input.svelte';
	import { fuzzySearch } from '$lib/utils/fuzzy-search';

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
		onSearchChange?: (value: string) => void;
		autoFilterItems?: boolean;
	}

	let {
		options,
		value = $bindable(null),
		open = $bindable(false),
		class: className = $bindable(''),
		emptyText = 'No options found...',
		placeholder = 'Select an option...',
		children,
		asChildren = false,
		onSelect,
		searchInput = $bindable(''),
		onSearchChange,
		autoFilterItems = false,
	}: Props = $props();

	let selectedValue = $derived(options.find((f) => f.value === value)?.label ?? placeholder);

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	let filteredOptions: { label: string; value: string }[] = $state(untrack(() => options));

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
			aria-expanded={open}
			class="w-[200px] justify-between"
		>
			{selectedValue}
			<CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input
				placeholder="Search framework..."
				class="h-9"
				bind:debouncedValue={searchInput}
				onInput={(val: string) => {
					console.log({ val });
				}}
			/>
			<Command.Empty>{emptyText}</Command.Empty>
			<Command.Group class={cn('command-group', className)}>
				{#each filteredOptions as option}
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
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
