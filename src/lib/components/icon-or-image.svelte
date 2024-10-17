<script lang="ts">
	import Icon from '@iconify/svelte';
	import { getIconName } from '$lib/utils';
	import { stringIsValidUrl } from '$lib/utils';

	let { src, alt }: { src: string; alt: string } = $props();
</script>

{#if stringIsValidUrl(src)}
	<img {src} {alt} class="h-[2em] w-[2em] text-inherit" role="presentation" />
{:else}
	<Icon
		aria-roledescription={`${getIconName(src)} icon`}
		icon={src}
		class="h-[1em] w-[1em] text-inherit"
		role="presentation"
	/>
{/if}
