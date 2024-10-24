<script lang="ts">
	import { page } from '$app/stores';
	import LinkForm from '$features/bento/forms/links/link-form.svelte';

	let {
		params: { slug, link_id },
	} = $derived($page);
</script>

<div class="form-container">
	<LinkForm bentoSlug={slug} id={link_id}></LinkForm>
</div>
