<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import { Plus } from 'svelte-radix';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/shadcn';

	let { children, data } = $props();
</script>

<div class="flex h-dvh w-full flex-row">
	<div class="z-10 m-0 flex h-full flex-col gap-2 border-r bg-card px-0 py-2 text-3xl *:m-1">
		<Button
			href="/"
			class="!m-0 w-full rounded-none border-b-2 pb-2 text-[length:inherit] text-card-foreground hover:text-primary"
			variant="link"
			size="icon"
		>
			<Icon icon="simple-icons:bento" class="h-[1em] w-[1em]" />
		</Button>
		{#if data.user?.bentos}
			{#each data.user.bentos as bento}
				<Button
					href="/bento/{bento.slug}"
					class={cn(
						' text-[length:inherit] shadow-inner hover:text-primary',
						bento.slug === data.slug && 'light bg-muted-foreground/20 '
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
			{/each}
			<div>
				<Button href="/bento/create" class="text-[length:inherit] " variant="ghost" size="icon">
					<Plus class="h-[1em] w-[1em]" />
				</Button>
			</div>
		{/if}
	</div>
	<div class="m-auto flex h-full max-w-6xl flex-1 flex-col justify-center gap-6 p-4">
		{@render children()}
	</div>
</div>

<style lang="postcss">
</style>
