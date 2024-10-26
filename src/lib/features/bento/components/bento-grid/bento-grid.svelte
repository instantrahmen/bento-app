<script lang="ts" module>
	export type Props = {
		slug: string;
	};
</script>

<script lang="ts">
	import type { APIGetUsersMeResponse } from '$features/auth/types/api';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { RefreshCw, SquarePen } from 'lucide-svelte';
	import LinkCard from './link-card.svelte';
	import { cn } from '$lib/utils/shadcn';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import { keys } from '$features/bento/api/keys';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import IconOrImage from '$lib/components/icon-or-image.svelte';

	let { slug }: Props = $props();

	type PageData = APIGetUsersMeResponse;
	let pageData: PageData = $derived($page.data) as PageData;
	const queryClient = useQueryClient();

	const query = createQuery(
		toReadable(() => ({
			...keys.bento({ slug }),
			initialData: pageData.user?.bentos.find((bento) => bento.slug === slug),
		}))
	);

	let currentBento = $derived($query.data);

	const refresh = () => {
		queryClient.invalidateQueries(keys.bentos({}));
		queryClient.invalidateQueries(keys.bento({ slug }));
	};

	// If less than 4 links, grid will auto fit. Default to 4 cols otherwise
	const gridStyles = (items: number) => {
		const base = 'grid-cols-4';
		if (items === 0) {
			return 'grid-cols-3 [&>*]:col-start-2 [&>*]:col-end-3';
		}
		if (items < 4) {
			return 'grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] max-w-lg mx-auto';
		}

		return base;
	};
</script>

<Button
	on:click={refresh}
	variant="default"
	size="icon"
	class={cn(
		'absolute bottom-20 right-4 z-10 h-12 w-12 rounded-full sm:bottom-4',

		$query.isLoading || ($query.isFetching && 'animate-spin')
	)}
>
	<RefreshCw class="h-5 w-5" />
</Button>
{#if currentBento}
	<header
		class={cn(
			'mx-0 my-2 h-12 w-max items-center rounded-md border bg-card px-2 shadow-md',
			'sm:my-4 sm:h-auto sm:w-full sm:flex-col sm:justify-center sm:border-none sm:bg-transparent sm:shadow-none ',
			'flex  flex-row items-center gap-2'
		)}
	>
		<IconOrImage
			src={currentBento.icon}
			alt="Main icon for {currentBento.title}"
			role="presentation"
			class="m-0 text-left text-3xl sm:text-5xl"
		/>
		<h2
			class="inline-flex flex-1 gap-2 text-2xl font-light tracking-wide text-muted-foreground sm:text-3xl"
		>
			{currentBento.title}

			<Button
				class="items-center text-center text-xl text-foreground/75 focus-visible:text-ring focus-visible:ring-2"
				variant="ghost"
				size="icon"
				href="/bento/{currentBento.slug}/edit"
			>
				<!-- <iconify-icon icon="lucide:square-pen" class="h-[1em] w-[1em] text-[1em]"></iconify-icon> -->
				<SquarePen class="h-[1em] w-[1em] text-[1em]"></SquarePen>
			</Button>
		</h2>
	</header>
{/if}

{#if $query.isLoading || $query.isFetching}
	<iconify-icon icon="mdi:loading" class="h-12 w-12 animate-spin"></iconify-icon>
{:else if $query.isError || !currentBento}
	<div class="flex flex-col items-center justify-center p-4 text-center">
		<h2 class="text-3xl font-semibold">404 - Not found</h2>
		<p class="text-lg">The requested bento ({slug}) could not be found</p>
	</div>
{:else if $query.data}
	{@const items = $query.data.links?.length || 0}
	<!-- Bento Grid -->
	<div class="relative mx-auto w-full max-w-2xl @container">
		<div class={cn('bento-grid', 'grid grid-flow-dense gap-1 sm:gap-2', gridStyles(items))}>
			{#each currentBento.links as link (link.id)}
				<LinkCard {link} />
			{/each}
			{#key currentBento.slug}
				<LinkCard
					link={{
						title: 'Add link',
						url: `/bento/${currentBento.slug}/add`,
						icon: 'lucide:plus',
					}}
					hideEditButton
					hideLabel
				/>
			{/key}
		</div>
	</div>
{/if}
