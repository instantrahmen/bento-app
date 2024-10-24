<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { ChevronLeft, ChevronRight } from 'svelte-radix';
	import { cn } from '$lib/utils/shadcn.js';

	type $$Props = DropdownMenuPrimitive.SubTriggerProps & {
		inset?: boolean;
		chevronLeft?: boolean;
	};
	type $$Events = DropdownMenuPrimitive.SubTriggerEvents;

	export let chevronLeft: boolean = false;
	let className: $$Props['class'] = undefined;
	export let inset: $$Props['inset'] = undefined;
	export { className as class };
</script>

<DropdownMenuPrimitive.SubTrigger
	class={cn(
		'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[state=open]:bg-accent data-[highlighted]:text-accent-foreground data-[state=open]:text-accent-foreground',
		inset && 'pl-8',
		className
	)}
	{...$$restProps}
	on:click
	on:keydown
	on:focusin
	on:focusout
	on:pointerleave
	on:pointermove
>
	{#if chevronLeft}
		<ChevronLeft class="mr-auto h-4 w-4" />
	{/if}
	<slot />
	{#if !chevronLeft}
		<ChevronRight class="ml-auto h-4 w-4" />
	{/if}
</DropdownMenuPrimitive.SubTrigger>
