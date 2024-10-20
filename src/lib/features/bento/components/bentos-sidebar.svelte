<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { slide } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import { keys } from '$features/bento/api/keys';
	import { page } from '$app/stores';
	import type { APIGetUsersMeResponse } from '$features/auth/types/api';
	import type { APIGetBentosResponse } from '../types/api';
	import { cn } from '$lib/utils';
	import { MediaQuery } from 'runed';
	import { media } from '$lib/utils/media-queries';
	import { useResizeObserver } from 'runed';
	import { onNavigate } from '$app/navigation';

	let screenMinSm = new MediaQuery(`(min-width: ${media.sm.min}px)`);
	let screenMinXs = new MediaQuery(`(max-width: ${media.sm.min - 100}px)`);

	// HACK: For some reason the effect isn't triggered by screenMinSm so I'm using this to force it every resize
	let screenWidth = $state(0);
	useResizeObserver(
		() => document.querySelector('body'),
		([bodyEl]) => {
			screenWidth = bodyEl?.contentRect.width;
		}
	);

	type PageData = APIGetUsersMeResponse & {
		slug?: string;
	};

	let pageData: PageData = $derived($page.data as PageData);

	const bentosQuery = createQuery(
		toReadable(() => ({
			...keys.bentos({}),
			initialData: pageData.user?.bentos,
		}))
	);

	type Bento = Pick<APIGetBentosResponse[0], 'title' | 'slug' | 'icon'>;

	let sidebarOpen = $state(true);

	const watch = (...args: any[]) => args;

	$effect(() => {
		watch(screenWidth);
		sidebarOpen = !!screenMinSm.matches;
	});

	onNavigate(() => {
		if (!screenMinSm.matches) {
			sidebarOpen = false;
		}
	});
</script>

{#if !sidebarOpen}
	<div class="absolute left-1 top-1 flex items-center justify-between text-3xl">
		<Button
			on:click={() => (sidebarOpen = !sidebarOpen)}
			class="relative p-1 text-[length:inherit]  focus-visible:text-ring active:shadow-inner *:active:scale-90"
			variant="ghost"
			size="icon"
		>
			<iconify-icon icon="f7-sidebar-left" class="h-[1em] w-[1em]"></iconify-icon>
		</Button>
	</div>
{/if}

{#if sidebarOpen}
	<div
		in:slide={{
			duration: 200,
			axis: 'x',
		}}
		out:slide={{
			duration: 200,
			axis: 'x',
		}}
		class={cn(
			'top-0 z-10 flex h-dvh flex-col gap-0 overflow-y-auto border-r bg-card px-0 py-0 text-3xl transition-all duration-300 *:m-1 sm:sticky sm:top-2 sm:my-2 sm:ml-2 sm:h-auto sm:rounded-md sm:border',
			!!screenMinXs.matches ? 'fixed w-full' : 'sticky'
		)}
	>
		<div class="flex items-center justify-between">
			<Button
				on:click={() => (sidebarOpen = !sidebarOpen)}
				class="relative p-1 text-[length:inherit] focus-visible:text-ring  active:shadow-inner *:active:scale-90 "
				variant="ghost"
				size="icon"
			>
				{@const icon = 'f7:sidebar-left'}
				<iconify-icon {icon} class="h-[1em] w-[1em]"></iconify-icon>
			</Button>
			<Button
				href="/"
				class="relative p-1 text-[length:inherit] focus-visible:text-ring  active:shadow-inner *:active:scale-90 sm:hidden"
				variant="link"
				size="icon"
			>
				<iconify-icon icon="material-symbols:bento" class="h-[1em] w-[1em]"></iconify-icon>
			</Button>
		</div>
		<hr />
		{#if !$bentosQuery.isLoading && !$bentosQuery.isError && $bentosQuery.data}
			{#each $bentosQuery.data as bento}
				{@render bentoLink({ bento })}
			{/each}
			<div>
				{@render bentoLink({
					bento: {
						title: 'Add a link',
						slug: 'create',
						icon: 'mdi:plus',
					},
				})}
			</div>
		{:else if $bentosQuery.isLoading}
			{@render bentoLink({
				bento: {
					title: 'Loading...',

					icon: 'mdi:loading',
					slug: 'loading',
				},
				class: 'animate-spin',
				disabled: true,
			})}
		{:else if $bentosQuery.isError}
			{@render bentoLink({
				bento: { title: 'Error', icon: 'mdi:alert-circle', slug: 'error' },
				disabled: true,
			})}
		{/if}
	</div>

	{#snippet bentoLink({
		disabled = false,
		class: className = '',
		bento,
	}: {
		bento: Bento;
		disabled?: boolean;
		class?: string;
	})}
		<Button
			href={!disabled ? `/bento/${bento.slug}` : undefined}
			class={cn(
				'h-12 justify-start gap-2 px-2 text-left sm:h-9 sm:justify-center sm:gap-0 sm:px-0',
				'relative text-[length:inherit] shadow-black/30  focus-visible:text-ring active:shadow-inner *:active:scale-90',
				bento.slug === pageData.slug &&
					'border bg-accent text-accent-foreground shadow-inner *:scale-95',
				bento.slug !== pageData.slug && 'text-muted-foreground',
				disabled &&
					'cursor-pointer text-muted-foreground hover:bg-transparent hover:text-muted-foreground',
				className
			)}
			variant="ghost"
			size={screenMinSm.matches ? 'icon' : 'lg'}
		>
			{#if bento.icon}
				<iconify-icon icon={bento.icon || ''} class="aspect-square h-[1em] w-[1em] text-[1em]"
				></iconify-icon>
			{:else}
				<span class="text-[1em] font-thin capitalize">{bento.title[0]}</span>
			{/if}
			<span class=" text-xs sm:sr-only">{bento.title}</span>
		</Button>
	{/snippet}
{/if}
