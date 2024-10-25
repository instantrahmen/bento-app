<script lang="ts">
	import SettingsForm from '$features/settings/forms/settings-form.svelte';

	let { data } = $props();
</script>

<SettingsForm authData={data} />

<style lang="postcss">
</style>
