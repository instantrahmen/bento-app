<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, getIconName } from '$lib/utils';
	import { stringIsValidUrl } from '$lib/utils';

	let {
		src,
		alt,
		class: className = '',
	}: HTMLAttributes<HTMLElement> & { src: string; alt: string; class?: string } = $props();
</script>

{#if stringIsValidUrl(src)}
	<img {src} {alt} class={cn('h-[5em] w-[5em] text-inherit', className)} />
{:else}
	<iconify-icon
		aria-roledescription={`${getIconName(src)} icon`}
		icon={src}
		class={cn('items-center self-center text-center text-[5em] text-inherit')}
		role="presentation"
	></iconify-icon>
{/if}
