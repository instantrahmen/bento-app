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
	import { createQuery } from '@tanstack/svelte-query';
	import IconOrImage from '$lib/components/icon-or-image.svelte';
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import { queries } from '$features/settings/api/queries';

	let {
		link: initLink,
		onClick,
		class: className = '',
		hideLabel = false,
		hideEditButton = false,
	}: LinkCardProps = $props();

	const settingsQuery = createQuery(
		toReadable(() =>
			queries.settings({
				userId: $page.data.user?.id,
			})
		)
	);

	let link: PartialLink = $state(untrack(() => ({ ...initLink })));

	const handleClick = (e: Event) => {
		if (onClick) {
			e.stopPropagation();
			e.preventDefault();
			onClick?.(e);
		}
	};

	let href = $derived(onClick ? undefined : link.url);

	let openInNewTab = $settingsQuery.data?.openLinksInNewTab ?? false;
</script>

<div
	class={cn(
		'square relative box-border h-full w-full text-card-foreground @container hover:text-primary',
		className
	)}
>
	<Button
		onclick={handleClick}
		variant="card"
		size="none"
		target={openInNewTab ? '_blank' : undefined}
		{href}
		class={cn('absolute left-0 top-0 h-full w-full @container focus-visible:text-ring')}
	>
		<div
			class="flex h-full w-full flex-col items-center justify-center gap-0 p-6 text-[0.5rem] text-inherit @[11rem]:text-sm @[16rem]:text-xl @sm:text-3xl"
		>
			<IconOrImage
				class="text-6xl @[6rem]:text-7xl"
				src={link.icon || 'https://placehold.co/600x400'}
				alt={link.title}
			/>
			<p
				class={cn(
					'sr-only  min-h-8 !overflow-visible text-wrap break-words text-center text-xs leading-none @[8rem]:not-sr-only @[8rem]:text-sm @[12rem]:text-xl',
					hideLabel && 'sr-only sm:sr-only'
				)}
			>
				{link.title}
			</p>
		</div>
	</Button>

	{#if !hideEditButton}
		<Button
			class="absolute right-2 top-2 hidden text-inherit focus-visible:text-ring focus-visible:ring-2 sm:flex"
			variant="ghost"
			size="icon"
			href="/bento/{$page.params.slug}/{link.id}"
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
