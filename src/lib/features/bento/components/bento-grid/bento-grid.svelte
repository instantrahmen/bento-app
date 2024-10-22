<script lang="ts" module>
	export type Props = {
		slug: string;
	};
</script>

<script lang="ts">
	import type { APIGetUsersMeResponse } from '$features/auth/types/api';
	import { createQuery } from '@tanstack/svelte-query';
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

	const query = createQuery(
		toReadable(() => ({
			...keys.bento({ slug }),
			initialData: pageData.user?.bentos.find((bento) => bento.slug === slug),
		}))
	);

	let currentBento = $derived($query.data);
</script>

{#if currentBento}
	<header class="my-4 flex flex-col items-center justify-center gap-2">
		<!-- Bento edit button -->
		<div class="square relative mx-auto">
			<IconOrImage
				src={currentBento.icon}
				alt="Main icon for {currentBento.title}"
				role="presentation"
			/>
		</div>
		<h2 class="font-lighter inline-flex items-center gap-2 text-3xl">
			{currentBento.title}

			<Button
				class="items-center text-center text-2xl focus-visible:text-ring focus-visible:ring-2"
				variant="ghost"
				size="icon"
				href="/bento/{currentBento.slug}/edit"
			>
				<iconify-icon icon="lucide:square-pen" class="h-[1em] w-[1em] text-[1em]"></iconify-icon>
			</Button>
		</h2>
	</header>
{/if}

{#if $query.isLoading}
	<iconify-icon icon="mdi:loading" class="h-12 w-12 animate-spin"></iconify-icon>
{:else if $query.isError || !currentBento}
	<div class="flex flex-col items-center justify-center p-4 text-center">
		<h2 class="text-3xl font-semibold">404 - Not found</h2>
		<p class="text-lg">The requested bento ({slug}) could not be found</p>
	</div>
{:else if $query.data}
	{@const items = $query.data.links.length}
	<!-- Bento Grid -->
	<div class="relative mx-auto w-full max-w-2xl @container">
		<div
			class={cn(
				'bento-grid',
				'grid grid-flow-dense gap-1 sm:gap-2',
				items === 0 && 'grid-cols-3 [&>*]:col-start-2 [&>*]:col-end-3',
				items > 0 && 'grid-cols-3 @2xl:grid-cols-4 @5xl:grid-cols-5'
			)}
		>
			{#each currentBento.links as link (link.id)}
				<LinkCard {link} />
			{/each}
			<LinkCard
				link={{
					title: 'Add link',
					url: `/bento/${currentBento.slug}/add`,
					icon: 'lucide:plus',
				}}
				hideEditButton
				hideLabel
			/>
			<!-- class="-col-start-1 -col-end-2" -->
		</div>
	</div>
{/if}
