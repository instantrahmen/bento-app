<script lang="ts">
	import { type APIGetBentosResponse } from '$features/bento/types/api';
	import { createQuery } from '@tanstack/svelte-query';

	import { cn } from '$lib/utils/shadcn';
	import { Button } from '$lib/components/ui/button';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import { keys } from '$features/bento/api/keys';
	import BentosSidebar from '$features/bento/components/bentos-sidebar.svelte';

	let { children, data } = $props();

	// const bentosQuery = createQuery(
	// 	toReadable(() => ({
	// 		...keys.bentos({}),
	// 		initialData: data.user?.bentos,
	// 	}))
	// );

	// let bentos = $derived($bentosQuery.data ?? []);
</script>

<div class="flex h-dvh w-full flex-row overflow-y-auto">
	<BentosSidebar />
	<div class="my-12 mr-2 flex min-h-full flex-1 flex-col text-base">
		{@render children()}
	</div>
</div>

<style lang="postcss">
</style>
