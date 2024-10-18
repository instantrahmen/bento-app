<svelte:options runes={true} />

<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { Button } from '$lib/components/ui/button';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import { keys } from '$features/bento/api/keys';
	import { page } from '$app/stores';
	import type { APIGetUsersMeResponse } from '$features/auth/types/api';
	import type { APIGetBentosResponse } from '../types/api';
	import { cn } from '$lib/utils';

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
</script>

<div
	class="sticky top-0 z-10 mr-2 flex flex-col gap-0 overflow-y-auto border-r bg-card px-0 py-0 text-3xl transition-all duration-300 *:m-1 sm:top-2 sm:m-2 sm:rounded-md sm:border"
>
	<Button
		href="/"
		class="relative p-1 text-[length:inherit]  focus-visible:text-ring active:shadow-inner *:active:scale-90"
		variant="link"
		size="icon"
	>
		<iconify-icon icon="material-symbols:bento" class="h-[1em] w-[1em]"></iconify-icon>
	</Button>
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
			'relative p-1 text-[length:inherit]  shadow-black/30 focus-visible:text-ring active:shadow-inner *:active:scale-90',
			bento.slug === pageData.slug &&
				'border bg-accent text-accent-foreground shadow-inner *:scale-95',
			bento.slug !== pageData.slug && 'text-muted-foreground',
			disabled &&
				'cursor-pointer text-muted-foreground hover:bg-transparent hover:text-muted-foreground',
			'h-9 justify-start gap-2 text-left sm:justify-center sm:gap-0',
			className
		)}
		variant="ghost"
		size="sm:icon"
	>
		{#if bento.icon}
			<iconify-icon icon={bento.icon || ''} class="h-[1em] w-[1em]"></iconify-icon>
		{:else}
			<span class="text-[1em] font-thin capitalize">{bento.title[0]}</span>
		{/if}
		<span class="text-xs sm:sr-only">{bento.title}</span>
	</Button>
{/snippet}
