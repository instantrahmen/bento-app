<script lang="ts">
	import { type APIGetBentosResponse } from '$features/bento/types/api';
	import { createQuery } from '@tanstack/svelte-query';
	import Icon from '@iconify/svelte';
	import { Plus } from 'svelte-radix';

	import { cn } from '$lib/utils/shadcn';
	import { Button } from '$lib/components/ui/button';
	import { getBentos } from '$lib/features/bento/api/index.js';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import { keys } from '$features/bento/api/keys';

	let { children, data } = $props();

	const bentosQuery = createQuery(toReadable(() => keys.bentos({})));

	let bentos = $derived($bentosQuery.data ?? []);

	type Bento = Pick<APIGetBentosResponse[0], 'title' | 'slug' | 'icon'>;
</script>

<div class="flex h-dvh w-full flex-row overflow-y-auto p-2">
	<div
		class="sticky top-0 z-10 flex h-full flex-col gap-2 overflow-y-auto rounded-md border bg-card px-0 py-3 text-3xl *:m-1"
	>
		<Button
			href="/"
			class="!m-0 w-full rounded-none border-b pb-2 text-[length:inherit] text-card-foreground "
			variant="link"
			size="icon"
		>
			<Icon icon="material-symbols:bento" class="h-[1em] w-[1em]" />
		</Button>
		{#if !$bentosQuery.isLoading && !$bentosQuery.isError}
			{#each bentos as bento}
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

	<div class="m-auto flex min-h-full max-w-6xl flex-1 flex-col justify-center gap-6 p-4">
		{@render children()}
	</div>
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
			'p-1 text-[length:inherit] shadow-blue-950/90 active:shadow-inner *:active:scale-90 dark:shadow-black',
			bento.slug === data.slug && 'light bg-muted-foreground/10 shadow-inner *:scale-95',
			bento.slug !== data.slug && 'text-muted-foreground',
			disabled &&
				'cursor-pointer text-muted-foreground hover:bg-transparent hover:text-muted-foreground',
			className
		)}
		variant="ghost"
		size="icon"
	>
		{#if bento.icon}
			<Icon icon={bento.icon || ''} class="h-[1em] w-[1em]" />
		{:else}
			<span class="text-[1em] font-thin capitalize">{bento.title[0]}</span>
		{/if}
	</Button>
{/snippet}

<style lang="postcss">
</style>
