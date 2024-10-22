<script lang="ts" module>
	import type { BentoLink } from '@prisma/client';
	import { Button } from '$lib/components/ui/button';

	type PartialLink = Partial<BentoLink> & Pick<BentoLink, 'title' | 'icon' | 'url'>;
	export type LinkCardProps = {
		link: PartialLink;
		onClick?: (e: Event) => void;
		hideLabel?: boolean;
		hideEditButton?: boolean;
		class?: string;
	};
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { Edit } from 'lucide-svelte';
	import IconOrImage from '$lib/components/icon-or-image.svelte';
	import { cn } from '$lib/utils';

	let {
		link: initLink,
		onClick,
		class: className = '',
		hideLabel = false,
		hideEditButton = false,
	}: LinkCardProps = $props();

	let link: PartialLink = $state(untrack(() => ({ ...initLink })));

	const handleClick = (e: Event) => {
		if (onClick) {
			e.stopPropagation();
			e.preventDefault();
			onClick?.(e);
		}
	};

	let href = $derived(onClick ? undefined : link.url);
</script>

<div
	class={cn(
		'square relative box-border h-full w-full text-primary-foreground @container',
		className
	)}
>
	<Button
		onclick={handleClick}
		variant="card"
		size="none"
		{href}
		class={cn('absolute left-0 top-0 h-full w-full overflow-hidden')}
	>
		<div
			class="flex h-full flex-col items-center justify-center gap-0 p-6 text-[0.5rem] text-card-foreground @[11rem]:text-sm @[16rem]:text-xl @sm:text-3xl"
		>
			<IconOrImage src={link.icon || 'https://placehold.co/600x400'} alt={link.title} />
			<span class={cn('text-xl font-semibold tracking-wide', hideLabel && 'sr-only')}>
				{link.title}
			</span>
		</div>
	</Button>

	{#if !hideEditButton}
		<Button
			class="absolute right-2 top-2 hidden text-card-foreground focus-visible:ring-2 sm:flex"
			variant="ghost"
			size="icon"
		>
			<Edit class="h-6 w-6" />
		</Button>
	{/if}
</div>

<style lang="postcss">
	.square::before {
		content: '';
		display: block;
		padding-top: 100%;
		max-height: 275px;
	}
</style>
