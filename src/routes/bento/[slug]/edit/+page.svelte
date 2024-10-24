<script lang="ts">
	import BentoForm from '$features/bento/forms/bentos/bento-form.svelte';

	let { data } = $props();
</script>

<div class="form-container">
	<BentoForm slug={data.slug} />
</div>

<style lang="postcss">
</style>
