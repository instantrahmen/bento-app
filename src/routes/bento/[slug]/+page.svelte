<script lang="ts">
	import BentoGrid from '$features/bento/components/bento-grid/bento-grid.svelte';

	let { data } = $props();
</script>

<BentoGrid slug={data.slug || 'unknown'} />
