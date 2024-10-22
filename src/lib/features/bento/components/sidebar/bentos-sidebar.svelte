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

	let screenMinSm = new MediaQuery(`(${media.sm.queryStringMin})`);
	let screenMaxXs = new MediaQuery(`(${media.xs.queryStringMax})`);

	type PageData = APIGetUsersMeResponse & {
		slug?: string;
	};

	let { type = 'sidenav' }: { type: 'sidenav' | 'bottomnav' } = $props();

	let sidenav = $derived(type === 'sidenav');
	let bottomnav = $derived(type === 'bottomnav');

	let pageData: PageData = $derived($page.data as PageData);

	const bentosQuery = createQuery(
		toReadable(() => ({
			...keys.bentos({}),
			initialData: pageData.user?.bentos,
		}))
	);

	let sidebarOpen = $state(true);

	const setSidebarBasedOnScreenSize = () => {
		if (type === 'bottomnav') return;
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

{#if type === 'sidenav'}
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
{/if}
{#if sidebarOpen}
	<div
		in:slide={{
			duration: 150,
			axis: sidenav ? 'x' : 'y',
		}}
		out:slide={{
			duration: 150,
			axis: sidenav ? 'x' : 'y',
		}}
		class={cn(
			'z-20 flex bg-card px-0 py-0 text-3xl transition-all duration-300 *:m-1 [&>*]:flex [&>*]:items-center [&>*]:justify-center',
			bottomnav &&
				'absolute bottom-0 left-0 h-16 w-dvw flex-row items-center justify-between gap-0 overflow-x-auto border-t py-2 text-3xl [&>*]:rounded-md',
			sidenav && 'fixed top-0 h-dvh w-full flex-col gap-0 overflow-y-auto border-r',
			sidenav && 'sm:sticky sm:top-2 sm:my-2 sm:ml-2 sm:h-auto sm:w-min sm:rounded-md sm:border'
		)}
	>
		<!-- {type} -->
		{#if type === 'sidenav'}
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
					class={cn(
						'relative p-1 text-[length:inherit] focus-visible:text-ring  active:shadow-inner *:active:scale-90 sm:hidden'
					)}
					variant="link"
					size="icon"
				>
					<iconify-icon icon="material-symbols:bento" class="h-[1em] w-[1em]"></iconify-icon>
				</Button>
			</div>
			<hr />
		{/if}
		{#if !$bentosQuery.isLoading && !$bentosQuery.isError && $bentosQuery.data}
			{#each $bentosQuery.data as bento}
				<BentoLink {bento} active={bento.slug === pageData.slug} />
			{/each}
			<div>
				<BentoLink
					bento={{ title: 'Add a link', slug: 'create', icon: 'lucide:plus' }}
					skipQuery
					hideLabel={bottomnav || screenMinSm.matches}
				/>
			</div>
		{:else if $bentosQuery.isLoading}
			<BentoLink
				bento={{ title: 'Loading...', icon: 'mdi:loading', slug: 'loading' }}
				disabled
				skipQuery
				hideLabel
			/>
		{:else if $bentosQuery.isError}
			<BentoLink
				bento={{ title: 'Error', icon: 'mdi:alert-circle', slug: 'error' }}
				disabled
				skipQuery
				hideLabel
			/>
		{/if}
	</div>
{/if}

<!-- <div class="absolute bottom-20 right-2">
	<DebugState
		state={{
			matchesSm: screenMinSm.matches,
			matchesXs: screenMaxXs.matches,
			qsminXs: media.xs.queryStringMin,
			qsminSm: media.sm.queryStringMin,
		}}
	/>
</div> -->
