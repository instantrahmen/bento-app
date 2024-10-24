<script lang="ts">
	import { MediaQuery } from 'runed';
	import BentosSidebar from '$features/bento/components/sidebar/bentos-sidebar.svelte';
	import { media } from '$lib/utils/media-queries';

	let { children } = $props();
	let screenMinSm = new MediaQuery(`(${media.sm.queryStringMin})`);

	let type: 'sidenav' | 'bottomnav' = $derived(screenMinSm.matches ? 'sidenav' : 'bottomnav');
</script>

<div class="flex h-dvh w-full flex-row overflow-y-auto">
	<BentosSidebar {type} />
	<div class="mx-2 flex min-h-full flex-1 flex-col text-base sm:mt-12">
		{@render children()}
	</div>
</div>

<style lang="postcss">
	:global(.form-container) {
		@apply mx-auto my-16 w-full max-w-xl rounded-md border bg-card p-4 shadow-md;
	}
</style>
