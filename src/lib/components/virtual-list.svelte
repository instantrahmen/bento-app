<!-- NOTE: Must keep as svelte 4 style component. Svelte 5 seems to break tanstack-virtual -->
<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import { createVirtualizer } from '@tanstack/svelte-virtual';

	let virtualListEl: HTMLDivElement | null = null;

	export let count = 10000;
	export let estimateSize = () => 35;
	export let overscan = 5;
	export let containerClass = '';
	export let childrenClass = '';
	export let listElement: HTMLDivElement | null = null;

	let className = '';
	export { className as class };

	$: virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
		count,
		getScrollElement: () => virtualListEl,
		estimateSize,
		overscan,
	});
</script>

<div class={cn('h-[200px] overflow-y-auto', containerClass)} bind:this={virtualListEl}>
	<div
		class={cn(className)}
		style="position: relative; height: {$virtualizer.getTotalSize()}px; width: 100%;"
	>
		{#each $virtualizer.getVirtualItems() as row, i (`${row.index}-${i}`)}
			<div
				class:list-item-even={row.index % 2 === 0}
				class:list-item-odd={row.index % 2 === 1}
				style="position: absolute; top: 0; left: 0; height: {row.size}px; transform: translateY({row.start}px);"
				class={cn(childrenClass)}
				bind:this={listElement}
			>
				<slot {row} index={row.index} allItems={$virtualizer.getVirtualItems()} />
			</div>
		{/each}
	</div>
</div>

<style>
</style>
