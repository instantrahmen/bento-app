<script lang="ts" module>
	import { Button } from '$lib/components/ui/button';
	import type { BentoLink } from '@prisma/client';

	export type LinkCardProps = {
		link: BentoLink;
		onClick?: (e: Event) => void;
		class?: string;
	};
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { Edit } from 'lucide-svelte';
	import IconOrImage from '$lib/components/icon-or-image.svelte';
	import { shapes } from '../../utils';
	import { cn } from '$lib/utils';

	let { link: initLink, onClick, class: className = '' }: LinkCardProps = $props();

	let link: BentoLink = $state(untrack(() => ({ ...initLink })));

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
		'square relative box-border h-full w-full text-primary-foreground',
		shapes[link.shape as keyof typeof shapes]
	)}
>
	<a
		onclick={handleClick}
		{href}
		class={cn(
			'absolute left-0 top-0 h-full w-full overflow-hidden',
			'rounded-md border bg-card outline-none ring-ring hover:bg-opacity-80 hover:shadow-lg focus-visible:ring-2'
		)}
	>
		<div class="flex h-full flex-col items-center justify-center gap-0 p-6 text-card-foreground">
			<IconOrImage
				src={link.icon || link.image || 'http://placekitten.com/300/300'}
				alt={link.title}
			/>
			<span class={cn('text-xl font-semibold tracking-wide', link.shape === 'xs' && 'sr-only')}
				>{link.title}</span
			>
		</div>
	</a>

	<Button
		class="absolute right-2 top-2 text-card-foreground focus-visible:ring-2"
		variant="ghost"
		size="icon"
	>
		<Edit class="h-6 w-6" />
	</Button>
</div>

<style lang="postcss">
	.square::before {
		content: '';
		display: block;
		padding-top: 100%;
		max-height: 275px;
	}
</style>
