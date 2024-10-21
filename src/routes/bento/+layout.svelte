<script lang="ts">
	import BentosSidebar from '$features/bento/components/bentos-sidebar.svelte';

	let { children } = $props();
</script>

<div class="flex h-dvh w-full flex-row overflow-y-auto">
	<BentosSidebar />
	<div class="mx-2 mt-12 flex min-h-full flex-1 flex-col text-base">
		{@render children()}
	</div>
</div>
