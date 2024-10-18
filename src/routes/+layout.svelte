<script lang="ts">
	import { enableCache } from 'iconify-icon';
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';

	import Navbar from './../lib/features/navbar/components/navbar.svelte';

	onMount(() => {
		enableCache('all');
	});
	let { children, data } = $props();
</script>

<svelte:head>
	<title>Bento App</title>
</svelte:head>

<QueryClientProvider client={data.queryClient}>
	<ModeWatcher />

	<Navbar {...data} />

	<main class="mx-auto my-auto flex h-full max-h-dvh w-full flex-1 flex-col">
		{@render children()}
	</main>
	<SvelteQueryDevtools />
</QueryClientProvider>

<style lang="postcss">
	:global(body) {
		@apply flex h-full min-h-dvh w-dvw max-w-full flex-col overflow-hidden;
	}
</style>
