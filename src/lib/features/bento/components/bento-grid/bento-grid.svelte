<script lang="ts">
	import { untrack } from 'svelte';
	import type { BentoLink } from '@prisma/client';
	import { createQuery } from '@tanstack/svelte-query';
	import { cn } from '$lib/utils/shadcn';
	import IconOrImage from '$lib/components/icon-or-image.svelte';
	import LinkCard from './link-card.svelte';
	import { shapes } from '$features/bento/utils';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import { keys } from '$features/bento/api/keys';
	import Icon from '@iconify/svelte';

	let {
		slug,
	}: {
		slug: string;
	} = $props();

	const query = createQuery(toReadable(() => keys.bento({ slug, fetch })));

	let currentBento = $derived($query.data);

	let newLink: BentoLink = {
		id: 'new-link',
		title: 'New Link',
		url: '',
		icon: 'mdi:plus',
		image: null,
		description: null,
		shape: 'wide',
		bentoId: untrack(() => currentBento?.id || ''),
		sortValue: null,
	};
</script>

{#if currentBento}
	<div class="flex w-full flex-col items-center gap-2 p-4 text-center">
		<IconOrImage
			src={currentBento.image || currentBento.icon || 'radix-icons:link-2'}
			alt={currentBento.title}
		/>

		<h2 class=" text-6xl font-thin">{currentBento.title}</h2>
		<p class="text-lg text-muted-foreground">{currentBento.description}</p>
	</div>

	{#if currentBento.links.length > 0}
		<div
			class={cn(
				'bento-grid grid grid-flow-dense items-center justify-center gap-1 text-3xl [grid-auto-rows:1fr] [grid-template-columns:repeat(auto-fill,minmax(12rem,1fr))]',
				currentBento.links.length < 3 &&
					'!grid-cols-[repeat(2,minmax(12rem,1fr))] items-center justify-center md:!grid-cols-[repeat(auto-fit,minmax(12rem,20rem))] [&>*]:md:max-h-60 '
			)}
		>
			{#each currentBento.links as link, i}
				<div
					class={cn(
						'h-full text-6xl text-primary-foreground/75',
						shapes[link.shape as keyof typeof shapes]
					)}
				>
					<!-- {@render bentoLink({ link, index: i, edit: editing[i] })} -->
					<LinkCard {link} editable />
				</div>
			{/each}

			<div class={cn('h-full items-center text-6xl text-primary-foreground/75')}>
				<LinkCard
					onClick={(e, setEditing) => {
						setEditing(true);
					}}
					link={newLink}
				/>
			</div>
		</div>
	{:else}
		<div class="mx-auto h-60 w-full p-4 text-3xl sm:max-w-60">
			<LinkCard
				onClick={(e, setEditing) => {
					setEditing(true);
				}}
				link={newLink}
			/>
		</div>
	{/if}
{:else if $query.isError}
	<div class="flex flex-col items-center justify-center p-4 text-center">
		<h2 class="text-3xl font-semibold">404 - Not found</h2>
		<p class="text-lg">The requested bento ({slug}) could not be found</p>
	</div>
{:else if $query.isLoading}
	<div class="flex flex-col items-center justify-center p-4 text-center">
		<h2 class="text-3xl font-semibold">
			<Icon icon="mdi:loading" class="h-12 w-12 animate-spin" />
		</h2>
	</div>
{/if}

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
