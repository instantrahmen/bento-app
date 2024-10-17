<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import BentoGrid from '$features/bento/components/bento-grid/bento-grid.svelte';
	import { keys } from '$features/bento/api/keys';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';

	let { data } = $props();

	const query = createQuery(toReadable(() => keys.bento({ slug: data.slug, fetch })));
</script>

<div class=" w-full items-center justify-center p-4 text-center text-9xl">
	{#if $query.isLoading}
		<p>Loading...</p>
	{:else if $query.isError}
		<p>Error: {$query.error}</p>
	{:else if $query.data}
		<BentoGrid slug={data.slug || 'unknown'} />
	{/if}
</div>
