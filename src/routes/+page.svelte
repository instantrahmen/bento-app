<script lang="ts">
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils/shadcn';
	import { buttonVariants } from '$lib/components/ui/button';
	import { afterNavigate, goto } from '$app/navigation';

	let { data } = $props();

	let { user, session } = $derived(data);

	afterNavigate(() => {
		// This should honestly never be called, but just to be safe we'll redirect both here and in `+page.ts`
		if (user) {
			goto(`/bento/${user.bentos[0].slug}`);
		}
	});
</script>

<main class="flex min-h-[calc(100vh-3rem)] flex-col justify-start gap-4 p-4">
	<h2 class="text-3xl font-semibold">Bento App</h2>

	<div class="flex flex-col gap-4 rounded-md border bg-card p-4 shadow">
		<h3 class="text-lg font-semibold">Please sign in to continue</h3>
		<p
			class="w-fit rounded-md border border-border/50 bg-muted/50 p-2 text-xs text-muted-foreground shadow-sm"
		>
			Note: offline/local-only mode and more auth providers coming soon
		</p>
		<SignIn provider="discord">
			<div
				slot="submitButton"
				class={cn(
					buttonVariants({
						variant: 'default',
						size: 'default',
						class: 'w-full',
					})
				)}
			>
				Sign in with Discord
			</div>
		</SignIn>
	</div>
</main>
