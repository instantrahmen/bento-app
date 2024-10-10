<script lang="ts">
	import Lightswitch from '$lib/components/Lightswitch.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import '../app.css';
	import { SignIn } from '@auth/sveltekit/components';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />

<!-- <svelte:body class="flex h-full w-full max-w-full overflow-hidden" /> -->

<nav class="fixed flex w-full flex-row justify-end gap-2 bg-none p-2">
	<div class="actions">
		<SignIn provider="discord">
			<div slot="submitButton" class={buttonVariants({ variant: 'default' })}>
				Sign in with Discord
			</div>
		</SignIn>
	</div>

	<Lightswitch />
</nav>

<main class="flex-growflex-col mx-auto my-auto flex h-full w-full flex-1">
	{@render children()}
</main>

<style lang="postcss">
	:global(body) {
		@apply flex h-full min-h-dvh w-dvw max-w-full flex-col overflow-hidden;
	}
</style>
