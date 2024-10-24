<script lang="ts">
	import { page } from '$app/stores';
	import LinkForm from '$features/bento/forms/links/link-form.svelte';

	let {
		params: { slug },
	} = $derived($page);
</script>

<div class="form-container">
	<LinkForm bentoSlug={slug}></LinkForm>
</div>
