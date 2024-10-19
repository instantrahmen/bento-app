<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import { untrack, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Debounced } from 'runed';
	import Portal from 'svelte-portal';

	let {
		open = $bindable(false),
		children,
		class: className = '',
		closeDelay = 2000,
		portal,
		openDelay = 50,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		followCursor?: boolean;
		open: boolean;
		openDelay?: number;
		closeDelay?: number;
		children: Snippet;
		portal?: HTMLElement | string;
	} = $props();

	let popoverEl: HTMLDivElement | null = $state(null);
	let popoverHovered = $state(false);

	const debouncedOpen = new Debounced(() => open || popoverHovered, openDelay);
	const debouncedClose = new Debounced(() => !open && !popoverHovered, closeDelay);

	let actuallyOpen = $state(untrack(() => open));

	const updateOpen = (_actuallyOpen = untrack(() => actuallyOpen)) => {
		if (debouncedOpen.current) {
			actuallyOpen = true;
		} else if (debouncedClose.current) {
			actuallyOpen = false;
		}
	};

	$effect(() => {
		updateOpen();
	});

	$effect(() => {
		if (open || popoverHovered) {
			debouncedClose.setImmediately(false);
		}
	});
</script>

<Portal target="body">
	{#if actuallyOpen}
		<!-- svelte-ignore a11y_no_static_element_interactions (This is just to keep the popover open when hover, it otherwise isn't an interactive element) -->
		<div
			in:slide={{ axis: 'y', duration: 200 }}
			out:slide={{ axis: 'y', duration: 200, delay: 200 }}
			class={cn('z-50', className)}
			bind:this={popoverEl}
			onmouseenter={() => (popoverHovered = true)}
			onmouseleave={() => (popoverHovered = false)}
			onfocusin={() => (popoverHovered = true)}
			onfocusout={() => (popoverHovered = false)}
			{...restProps}
		>
			{@render children()}
		</div>
	{/if}
</Portal>
