<script lang="ts">
	import { fade } from 'svelte/transition';
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

	const debouncedOpen = new Debounced(() => open, openDelay);
	const debouncedClose = new Debounced(() => !open, closeDelay);

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
		if (open) {
			debouncedClose.setImmediately(false);
		}
	});
</script>

<Portal target="body">
	{#if actuallyOpen}
		<div
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200, delay: 200 }}
			class={cn('z-50', className)}
			bind:this={popoverEl}
			{...restProps}
		>
			{@render children()}
		</div>
	{/if}
</Portal>
