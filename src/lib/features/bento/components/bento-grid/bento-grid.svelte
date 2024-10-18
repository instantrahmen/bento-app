<script lang="ts" module>
	export type Props = {
		slug: string;
	};
</script>

<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { cn } from '$lib/utils/shadcn';
	import LinkCard from './link-card.svelte';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import { keys } from '$features/bento/api/keys';
	import { page } from '$app/stores';
	import type { APIGetUsersMeResponse } from '$features/auth/types/api';

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

{#if $query.isLoading}
	<iconify-icon icon="mdi:loading" class="h-12 w-12 animate-spin"></iconify-icon>
{:else if $query.isError || !currentBento}
	<div class="flex flex-col items-center justify-center p-4 text-center">
		<h2 class="text-3xl font-semibold">404 - Not found</h2>
		<p class="text-lg">The requested bento ({slug}) could not be found</p>
	</div>
{:else if $query.data}
	<!-- Bento Grid -->
	<div class="@container">
		<div
			class={cn(
				'bento-grid',
				'grid grid-flow-dense gap-2',
				// Grid size
				'grid-cols-2 @sm:grid-cols-4 @3xl:grid-cols-6 @5xl:grid-cols-8 @7xl:grid-cols-10'
			)}
		>
			{#each currentBento.links as link (link.id)}
				<LinkCard {link} />
			{/each}
		</div>
	</div>
{/if}

<pre>
	{JSON.stringify({ slug }, null, 2)}
	{JSON.stringify($query.data, null, 2)}
</pre>
