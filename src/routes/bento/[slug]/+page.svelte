<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import type { BentoLink } from '@prisma/client';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/utils/shadcn';
	import { untrack } from 'svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

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

	const shapeIcons = {
		wide: 'simple-icons:rectangle', // a wide rectangle icon
	};

	let bentoLinkShapeTest: string[] = [
		shapes['squareSm'],
		shapes['wide'],
		shapes['tall'],
		shapes['squareSm'],
		shapes['squareLg'],
	];

	const stringIsValidUrl = (url: string): boolean => {
		try {
			const urlObj = new URL(url);
			return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
		} catch {
			return false;
		}
	};
	const linkIds = $derived((currentBento?.links ?? []).map(({ id }) => id));

	const editingInitialValue = untrack(() => Object.fromEntries(linkIds.map((id) => [id, false])));

	let editing = $state(editingInitialValue);
</script>

{#if currentBento}
	<div class="flex flex-col gap-2 p-4 text-center">
		{#if currentBento.image || stringIsValidUrl(currentBento.icon || '')}
			<img
				src={currentBento.image || currentBento.icon || 'https://placehold.co/128x128'}
				alt={currentBento.title}
				class="w-full max-w-3xl rounded-lg shadow-md"
			/>
		{:else if currentBento.icon}
			<Icon icon={currentBento.icon || ''} class="mx-auto h-28 w-28 text-foreground" />
		{/if}
		<h2 class=" text-6xl font-thin">{currentBento.title}</h2>
		<p class="text-lg text-muted-foreground">{currentBento.description}</p>
	</div>

	{#if currentBento.links.length > 0}
		<div
			class="bento-grid grid grid-flow-dense gap-1 text-3xl [grid-auto-rows:1fr] [grid-template-columns:repeat(auto-fill,minmax(12rem,1fr))]"
		>
			{#each currentBento.links as link, i}
				<div
					class={cn(
						'text-6xl text-primary-foreground/75',
						shapes[link.shape as keyof typeof shapes]
					)}
				>
					{@render bentoLink({ link, index: i, edit: editing[i] })}
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
				onClick: () => {},
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
				hideEditButton: true,
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
	index,
	onClick,
	edit = false,
	hideEditButton = false,
}: {
	link: LinkData;
	onClick?: (e: Event) => void;
	index?: number;
	edit?: boolean;
	hideEditButton?: boolean;
})}
	{#if edit}
		{@render bentoLinkEditable({
			link,
			index,
		})}
	{:else}
		<div class="relative h-full">
			<Button
				href={!!link.url ? link.url : undefined}
				variant="card"
				on:click={(e) => {
					if (onClick) onClick(e);
				}}
				class={cn(
					'z-0 flex h-full w-full flex-col rounded-sm border p-4 text-[length:inherit] text-card-foreground/90 shadow-md hover:z-0 '
				)}
			>
				{#if link.icon}
					{#if stringIsValidUrl(link.icon || '')}
						<img
							src={link.icon || 'https://placehold.co/128x128'}
							alt={link.title}
							class="h-[2em] w-[2em] text-inherit"
						/>
					{:else}
						<Icon icon={link.icon || ''} class="h-[1em] w-[1em] text-inherit" />
					{/if}
				{/if}
				<h3 class="text-base font-semibold tracking-wide">{link.title}</h3>
				<!-- <span
				class="line-clamp-1 block w-full max-w-full overflow-ellipsis break-words text-center text-xs tracking-wide text-card-foreground/35"
				>{link.url}</span
			> -->
			</Button>

			{#if !hideEditButton}
				<Button
					variant="ghost"
					size="icon"
					class="absolute right-2 top-2 text-card-foreground/90"
					on:click={(e) => {
						e.stopPropagation();
						e.preventDefault();
						if (index) {
							editing[index] = !editing[index];
						}
					}}
				>
					<Icon icon="ci:edit" class="h-[1em] w-[1em]" />
				</Button>
			{:else}
				<span> hidden</span>
			{/if}
		</div>
	{/if}
{/snippet}

{#snippet bentoLinkEditable({
	link,
	index,
}: {
	link: LinkData;
	onClick?: (e: Event) => void;
	index?: number;
})}
	<form
		action="?/updateLink"
		method="post"
		class={cn(
			'@container',
			buttonVariants({ variant: 'default' }),
			'relative flex h-full w-full flex-col gap-2 rounded-sm border bg-card p-4 text-[length:inherit] text-card-foreground/90 shadow-md hover:bg-card'
		)}
	>
		<Button
			variant="ghost"
			size="icon"
			class="absolute right-2 top-2"
			on:click={(e) => {
				e.stopPropagation();
				e.preventDefault();
				// confirm('Add a link?');

				if (index) {
					editing[index] = !editing[index];
				}
			}}
		>
			<Icon icon="ci:save" class="h-[1em] w-[1em]" />
		</Button>
		{#if link.icon}
			<Icon icon={link.icon || ''} class="h-[1em] w-[1em] text-inherit" />
		{/if}
		<div class="flex w-full flex-col gap-2 @xs:flex-row @xs:items-center">
			<Label for={`title-${index}`}>Name</Label>
			<Input
				id={`title-${index}`}
				class="w-full text-lg font-semibold"
				placeholder={link.title}
				name="title"
				value={link.title}
			/>
		</div>
		<div class="flex w-full flex-col gap-2 @xs:flex-row @xs:items-center">
			<Label for={`url-${index}`}>URL</Label>
			<Input
				id={`url-${index}`}
				class="w-full text-sm font-medium text-muted-foreground/50 placeholder-muted-foreground/35"
				placeholder="https://example.com"
				name="url"
				value={link.url}
			/>
		</div>
		<!-- <span
			class="line-clamp-1 block w-full max-w-full overflow-ellipsis break-words text-center text-xs tracking-wide text-card-foreground/35"
			>{link.url}</span
		> -->
	</form>
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
