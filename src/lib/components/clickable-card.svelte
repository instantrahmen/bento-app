<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import { Button, buttonVariants } from './ui/button';
	import { cn } from '$lib/utils/shadcn';

	export type LinkCardProps = {
		href?: string;
		class?: string;
		containerClass?: string;
		onClick?: (e: Event) => void;
		children?: Snippet;
		disabled?: boolean;
	};
</script>

<script lang="ts">
	let {
		href,
		class: className = '',
		containerClass = '',
		onClick,
		children,
		disabled,
	}: LinkCardProps = $props();

	const sharedClasses =
		'relative z-0 flex h-full w-full flex-col gap-2 rounded-sm border p-4 text-[length:inherit] text-card-foreground/90 shadow-md';

	const disabledClasses = cn(buttonVariants({ variant: 'card' }), 'hover:z-0 hover:bg-card');
</script>

<!-- <div class={cn('relative h-full', containerClass)}> -->
{#if !disabled}
	<Button
		{href}
		variant="card"
		on:click={(e) => {
			onClick?.(e);
		}}
		class={cn(sharedClasses, className)}
	>
		{@render children?.()}
	</Button>
{:else}
	<div class={cn(sharedClasses, disabledClasses, className)} data-disabled>
		{@render children?.()}
	</div>
{/if}
