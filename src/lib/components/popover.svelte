<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		open = $bindable(false),
		children,
		popover = 'auto',
		class: className = '',
		closeDelay = 0,
		openDelay = 0,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		followCursor?: boolean;
		open: boolean;
		openDelay?: number;
		closeDelay?: number;
		children: Snippet;
	} = $props();

	let popoverEl: HTMLDivElement | null = $state(null);
	$effect(() => {
		if (!popoverEl) {
			return;
		}

		if (open) {
			// open after delay
			setTimeout(() => {
				popoverEl?.togglePopover(open);
			}, openDelay);
		} else {
			// close after delay
			setTimeout(() => {
				popoverEl?.togglePopover(open);
			}, closeDelay);
		}
		// popoverEl.togglePopover(open);
	});
</script>

<div {popover} class={cn(className)} bind:this={popoverEl} {...restProps}>
	{@render children()}
</div>
