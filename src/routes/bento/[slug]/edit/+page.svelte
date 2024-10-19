<script lang="ts">
	import BentoForm from '$features/bento/forms/bentos/bento-form.svelte';

	let { data } = $props();
</script>

<BentoForm slug={data.slug} />

<style lang="postcss">
</style>
