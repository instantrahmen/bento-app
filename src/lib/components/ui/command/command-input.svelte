<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import MagnifyingGlass from 'svelte-radix/MagnifyingGlass.svelte';
	import { cn } from '$lib/utils/shadcn';
	import { debounce } from '$lib/utils/debounce';

	type Props = Input['$$props'] & {
		value: string;
		debouncedValue?: string;
		onInput?: (value: string) => void;
		onDebouncedInput?: (value: string) => void;
		debounceTime?: number;
	};

	let {
		class: className = '',
		value = $bindable(''),
		debouncedValue = $bindable(''),
		onInput,
		onDebouncedInput,
		debounceTime = $bindable(500),
		...restProps
	}: Props = $props();

	const debouncedInput = debounce((value: string) => {
		debouncedValue = value;
		if (onDebouncedInput) {
			onDebouncedInput(value);
		}
	}, debounceTime);
</script>

<div
	class="flex items-center border-b px-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent"
>
	<MagnifyingGlass class="mr-2 h-4 w-4 shrink-0 opacity-50" />
	<Input
		class={cn(
			'flex h-10 w-full rounded-md border-none bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		{...restProps}
		bind:value
		on:change
		on:focus
		on:keydown
		on:input={() => {
			if (onInput) {
				onInput(value);
			}

			debouncedInput(value);
		}}
	/>
</div>
