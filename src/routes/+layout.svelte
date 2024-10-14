<script lang="ts">
	import Lightswitch from '$lib/components/light-switch.svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import * as Avatar from '$lib/components/ui/avatar';
	import { buttonVariants } from '$lib/components/ui/button';
	import '../app.css';
	import { SignIn } from '@auth/sveltekit/components';
	import { ModeWatcher } from 'mode-watcher';
	import { browser } from '$app/environment';

	let { children, data } = $props();

	const getInitials = (name: string) => {
		// Valid separators: " " "-" "." "_"
		return name
			.split(/[\s-_.]+/)
			.map((n) => n[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	};

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
			},
		},
	});
</script>

<ModeWatcher />

<!-- <svelte:body class="flex h-full w-full max-w-full overflow-hidden" /> -->
<QueryClientProvider client={queryClient}>
	<nav class=" fixed flex h-12 w-full flex-row items-center justify-end gap-2 bg-none p-2">
		<Lightswitch />

		{#if !data.session || !data.session.user}
			<div class="actions">
				<SignIn provider="discord">
					<div slot="submitButton" class={buttonVariants({ variant: 'default' })}>
						Sign in with Discord
					</div>
				</SignIn>
			</div>
		{:else}
			<Avatar.Root class="border border-green-600 dark:border-green-400">
				<Avatar.Image src={data.session.user.image} alt={data.session.user.name} />
				<Avatar.Fallback>
					{getInitials(data.session.user.name ?? 'User')}
				</Avatar.Fallback>
			</Avatar.Root>
		{/if}
	</nav>

	<main class="mx-auto my-auto flex h-full max-h-dvh w-full flex-1 flex-col">
		{@render children()}
	</main>
</QueryClientProvider>

<style lang="postcss">
	:global(body) {
		@apply flex h-full min-h-dvh w-dvw max-w-full flex-col overflow-hidden;
	}
</style>
