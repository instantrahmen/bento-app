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
	import { onMount } from 'svelte';
	import DebugState from '$lib/components/debug/debug-state.svelte';

	let screenMinSm = new MediaQuery(`(${media.sm.queryStringMin})`);
	let screenMaxXs = new MediaQuery(`(${media.xs.queryStringMax})`);

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

	const setSidebarBasedOnScreenSize = () => {
		if (sidebarOpen) {
			if (!screenMinSm.matches) {
				sidebarOpen = false;
			}
		} else if (screenMinSm.matches) {
			sidebarOpen = true;
		}
	};

	onMount(() => {
		useResizeObserver(
			() => document.querySelector('body'),
			() => {
				setSidebarBasedOnScreenSize();
			}
		);
	});

	onNavigate(() => {
		setSidebarBasedOnScreenSize();
	});
</script>

{#if !sidebarOpen}
	<div class="absolute left-1 top-1 flex items-center justify-between text-3xl">
		<Button
			on:click={() => (sidebarOpen = !sidebarOpen)}
			class="relative p-1 text-[length:inherit] text-xl  focus-visible:text-ring active:shadow-inner *:active:scale-90 sm:m-2"
			variant="ghost"
			size="icon"
		>
			<iconify-icon icon="f7:sidebar-left" class="h-[1em] w-[1em]"></iconify-icon>
		</Button>
	</div>
{/if}

{#if sidebarOpen}
	<div
		in:slide={{
			duration: 150,
			axis: 'x',
		}}
		out:slide={{
			duration: 150,
			axis: 'x',
		}}
		class={cn(
			'top-0 z-10 flex h-dvh flex-col gap-0 overflow-y-auto border-r bg-card px-0 py-0 text-3xl transition-all duration-300 *:m-1',
			'sm:sticky sm:top-2 sm:my-2 sm:ml-2 sm:h-auto sm:rounded-md sm:border',
			!!screenMaxXs.matches ? 'fixed w-full' : 'sticky'
		)}
	>
		<div class="flex items-center justify-between">
			<Button
				on:click={() => (sidebarOpen = !sidebarOpen)}
				class="relative p-1 text-[length:inherit] text-xl focus-visible:text-ring  active:shadow-inner *:active:scale-90 "
				variant="ghost"
				size="icon"
			>
				{@const icon = 'f7:sidebar-left'}
				<iconify-icon {icon} width="1em" height="1em" class="h-[1em] w-[1em]"></iconify-icon>
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
						icon: 'lucide:plus',
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
{/if}

<div class="absolute bottom-20 right-2">
	<DebugState
		state={{
			matchesSm: screenMinSm.matches,
			matchesXs: screenMaxXs.matches,
			qsminXs: media.xs.queryStringMin,
			qsminSm: media.sm.queryStringMin,
		}}
	/>
</div>
