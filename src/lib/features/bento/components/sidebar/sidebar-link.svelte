<script module lang="ts">
	import type { Bento } from '@prisma/client';

	type PartialBento = Partial<Bento> & Pick<Bento, 'slug' | 'title' | 'icon'>;

	export type Props = {
		bento: PartialBento;
		disabled?: boolean;
		class?: string;
		active?: boolean;
		skipQuery?: boolean;
		hideLabel?: boolean;
	};
</script>

<script lang="ts">
	import type { APIGetBentoResponse } from '$features/bento/types/api';
	import { createQuery } from '@tanstack/svelte-query';
	import { readable } from 'svelte/store';
	import { keys } from '../../api/keys';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils/shadcn';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';

	let {
		bento,
		disabled = false,
		class: className,
		active = false,
		skipQuery = false,
		hideLabel = true,
	}: Props = $props();

	const bentoQuery = skipQuery
		? readable(null)
		: createQuery(
				toReadable(() => ({
					...keys.bento({ slug: bento.slug }),
					initialData: bento as APIGetBentoResponse,
				}))
			);
</script>

{#if !skipQuery && !!$bentoQuery}
	{#if $bentoQuery.isLoading}
		<div class="flex items-center justify-center rounded-md py-1 text-center">
			<iconify-icon
				icon="lucide:loader-circle"
				class="aspect-square h-[1em] w-[1em] animate-spin text-[1em]"
			></iconify-icon>
		</div>
	{:else if $bentoQuery.isError || !$bentoQuery.data}
		<div class="">
			<iconify-icon icon="lucide:circle-alert" class="aspect-square h-[1em] w-[1em] text-[1em]"
			></iconify-icon>
		</div>
	{:else}
		{@render bentoLink({ bento: $bentoQuery.data })}
	{/if}
{:else}
	{@render bentoLink({ bento })}
{/if}

{#snippet bentoLink({ bento }: { bento: PartialBento })}
	<Button
		href={!disabled ? `/bento/${bento.slug}` : undefined}
		class={cn(
			'gap-0 px-2 text-left sm:px-0 ',
			'relative rounded-xl text-[length:inherit] shadow-black/30 focus-visible:text-ring active:shadow-inner *:active:scale-75',
			' hover:text-primary',
			hideLabel ? 'aspect-square h-full w-full justify-center sm:h-9 sm:w-min' : 'justify-start',
			active && 'rounded-xl border bg-accent text-primary shadow-inner *:scale-90 dark:bg-accent',
			!active && 'text-muted-foreground',
			disabled &&
				'cursor-pointer text-muted-foreground hover:bg-transparent hover:text-muted-foreground',
			className
		)}
		variant="ghost"
		size={hideLabel ? 'icon' : 'lg'}
	>
		{#if bento.icon}
			<iconify-icon
				width="1em"
				height="1em"
				icon={bento.icon || ''}
				class="aspect-square h-[1em] w-[1em] text-[1em]"
			></iconify-icon>
		{:else}
			<span class="text-[1em] font-thin capitalize">{bento.title[0]}</span>
		{/if}
		<span class={cn('text-xs sm:sr-only', hideLabel && 'sr-only')}>{bento.title}</span>
	</Button>
{/snippet}
