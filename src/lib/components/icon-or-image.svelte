<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, getIconName, stringIsValidUrl } from '$lib/utils';

	let {
		src,
		alt,
		class: className = '',
	}: HTMLAttributes<HTMLElement> & { src: string; alt: string; class?: string } = $props();
</script>

{#if stringIsValidUrl(src)}
	<img {src} {alt} class={cn('h-[10em] w-[10em] text-inherit', className)} />
{:else}
	<iconify-icon
		aria-roledescription={`${getIconName(src)} icon`}
		icon={src}
		height="1em"
		width="1em"
		class={cn('items-center self-center text-center text-[5em] text-inherit', className)}
		role="presentation"
	></iconify-icon>
{/if}
