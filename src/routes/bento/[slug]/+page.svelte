<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { BentoLink } from '@prisma/client';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/utils/shadcn';

	let { data } = $props();

	let bentos = $derived(data.user?.bentos ?? []);
	let currentBento = $derived(bentos.find((bento) => bento.slug === data.slug));

	type LinkData = Pick<BentoLink, 'title' | 'description' | 'url' | 'icon' | 'image'>;

	const shapes = {
		wide: 'col-span-1 row-span-2',
		squareSm: 'col-span-1 row-span-1',
		squareLg: 'col-span-2 row-span-2',
		tall: 'col-span-2 row-span-1',
	};

	let bentoLinkShapeTest: string[] = [
		// shapes['squareSm'],
		// shapes['wide'],
		// shapes['tall'],
		// shapes['squareSm'],
		// shapes['squareLg'],
	];
</script>

{#if currentBento}
	<div class="flex flex-col gap-2 p-4 text-center">
		{#if currentBento.image}
			<img
				src={currentBento.image}
				alt={currentBento.title}
				class="w-full max-w-3xl rounded-lg shadow-md"
			/>
		{:else if currentBento.icon}
			<Icon icon={currentBento.icon || ''} class="mx-auto h-28 w-28 text-foreground/50" />
		{/if}
		<h2 class=" text-6xl font-thin">{currentBento.title}</h2>
		<p class="text-lg">{currentBento.description}</p>
	</div>

	{#if currentBento.links.length > 0}
		<div
			class="bento-grid grid gap-1 text-3xl [grid-auto-rows:1fr] [grid-template-columns:repeat(auto-fill,minmax(12rem,1fr))]"
		>
			{#each [...currentBento.links, ...currentBento.links, ...currentBento.links] as link, i}
				<div class={cn('text-6xl text-primary-foreground/75', bentoLinkShapeTest[i] || '')}>
					{@render bentoLink({ link, index: i })}
				</div>
			{/each}

			{@render bentoLink({
				link: {
					title: 'New Link',
					url: ``,
					icon: 'mdi:plus',
					image: null,
					description: null,
				},
				onClick: () => {
					// confirm('Add a link?');
				},
			})}
		</div>
	{:else}
		<div class="mx-auto h-60 w-full p-4 text-3xl sm:max-w-60">
			{@render bentoLink({
				link: {
					title: 'Add a link',
					url: '',
					icon: 'mdi:plus',
					image: null,
					description: null,
				},
				onClick: () => {
					// confirm('Add a link?');
				},
			})}
		</div>
	{/if}
{:else}
	<div class="p-4">
		<h2 class="text-3xl font-semibold">404 - Not found</h2>
		<p class="text-lg">The requested bento ({data.slug}) could not be found</p>
	</div>
{/if}

{#snippet bentoLink({
	link,
	onClick,
}: {
	link: LinkData;
	onClick?: (e: Event) => void;
	index?: number;
})}
	<Button
		href={!!link.url ? link.url : undefined}
		on:click={(e) => {
			if (onClick) onClick(e);
		}}
		class={cn(
			'flex h-full w-full flex-col rounded-sm border bg-card p-4 text-[length:inherit] text-card-foreground/90 shadow-md'
			// bentoLinkShapeTest[index]
		)}
	>
		{#if link.icon}
			<Icon icon={link.icon || ''} class="h-[1em] w-[1em] text-inherit" />
		{/if}
		<h3 class="text-base font-semibold tracking-wide">{link.title}</h3>
		<span
			class="line-clamp-1 block w-full max-w-full overflow-ellipsis break-words text-center text-xs tracking-wide text-card-foreground/35"
			>{link.url}</span
		>
	</Button>
{/snippet}

<style lang="postcss">
	@media (min-width: 640px) {
		.bento-grid::before {
			content: '';
			width: 0;
			padding-bottom: 100%;
			grid-row: 1 / 1;
			grid-column: 1 / 1;
		}
	}

	.bento-grid > *:first-child {
		grid-row: 1 / 1;
		grid-column: 1 / 1;
	}
</style>
