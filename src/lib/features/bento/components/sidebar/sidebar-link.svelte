<script module lang="ts">
	import type { Bento } from '@prisma/client';

	type PartialBento = Partial<Bento> & Pick<Bento, 'slug' | 'title' | 'icon'>;

	export type Props = {
		bento: PartialBento;
		disabled?: boolean;
		class?: string;
		active?: boolean;
		skipQuery?: boolean;
	};
</script>

<script lang="ts">
	import { MediaQuery } from 'runed';
	import { createQuery } from '@tanstack/svelte-query';
	import { readable } from 'svelte/store';
	import { keys } from '../../api/keys';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils/shadcn';
	import { media } from '$lib/utils/media-queries';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';

	let {
		bento,
		disabled = false,
		class: className,
		active = false,
		skipQuery = false,
	}: Props = $props();

	let screenMinSm = new MediaQuery(`(${media.sm.queryStringMin})`);

	const bentoQuery = skipQuery
		? readable(null)
		: createQuery(
				toReadable(() => ({
					...keys.bento({ slug: bento.slug }),
					initialData: bento,
				}))
			);
</script>

{#if !skipQuery && !!$bentoQuery}
	{#if $bentoQuery.isLoading}
		<div class=" flex items-center justify-center rounded-md py-1 text-center">
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
			'h-12 justify-start gap-2 px-2 text-left sm:h-9 sm:justify-center sm:gap-0 sm:px-0',
			'relative rounded-xl text-[length:inherit] shadow-black/30 focus-visible:text-ring active:shadow-inner *:active:scale-75',
			active && 'rounded-xl border bg-accent text-accent-foreground shadow-inner *:scale-90',
			// active && 'rounded-lg border border-background bg-accent text-accent-foreground *:scale-95',
			!active && 'text-muted-foreground',
			disabled &&
				'cursor-pointer text-muted-foreground hover:bg-transparent hover:text-muted-foreground',
			className
		)}
		variant="ghost"
		size={screenMinSm.matches ? 'icon' : 'lg'}
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
		<span class=" text-xs sm:sr-only">{bento.title}</span>
	</Button>
{/snippet}
