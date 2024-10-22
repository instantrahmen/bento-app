<script lang="ts">
	import type { APIGetUsersMeResponse } from '$features/auth/types/api';
	import { createQuery } from '@tanstack/svelte-query';
	import { slide } from 'svelte/transition';
	import { MediaQuery, useResizeObserver } from 'runed';
	import { onMount } from 'svelte';
	import BentoLink from './sidebar-link.svelte';
	import { Button } from '$lib/components/ui/button';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import { keys } from '$features/bento/api/keys';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { media } from '$lib/utils/media-queries';
	import { onNavigate } from '$app/navigation';
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

	let sidebarOpen = $state(true);

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
			'top-0 z-20 flex h-dvh flex-col gap-0 overflow-y-auto border-r bg-card px-0 py-0 text-3xl transition-all duration-300 *:m-1',
			'sm:sticky sm:top-2 sm:my-2 sm:ml-2 sm:h-auto sm:rounded-md sm:border',
			screenMaxXs.matches ? 'fixed w-full' : 'sticky'
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
				<BentoLink {bento} active={bento.slug === pageData.slug} />
			{/each}
			<div>
				<BentoLink bento={{ title: 'Add a link', slug: 'create', icon: 'lucide:plus' }} skipQuery />
			</div>
		{:else if $bentosQuery.isLoading}
			<BentoLink
				bento={{ title: 'Loading...', icon: 'mdi:loading', slug: 'loading' }}
				disabled
				skipQuery
			/>
		{:else if $bentosQuery.isError}
			<BentoLink
				bento={{ title: 'Error', icon: 'mdi:alert-circle', slug: 'error' }}
				disabled
				skipQuery
			/>
		{/if}
	</div>
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
