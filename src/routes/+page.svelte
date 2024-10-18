<script lang="ts">
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils/shadcn';
	import { buttonVariants } from '$lib/components/ui/button';

	let { data } = $props();

	let { user, session } = $derived(data);
</script>

<h2 class="text-3xl font-semibold">Bento App</h2>
<div>
	{#if session}
		{#if session.user?.image}
			<img src={session.user.image} class="avatar" alt="User Avatar" />
		{/if}
		<span class="signedInText">
			<small>Signed in as</small><br />
			<strong>{session.user?.name ?? 'User'}</strong>
		</span>
		<SignOut>
			<div slot="submitButton" class="buttonPrimary">Sign out</div>
		</SignOut>

		{#if user}
			<div class="rounded border border-border bg-card p-4 shadow">
				<Button variant="outline" href="/bento">Bentos</Button>
				<Button variant="outline" href="/test">Test Page</Button>
			</div>
			<pre>
{JSON.stringify({ user, session }, null, 2)}
			</pre>
		{/if}
	{:else}
		<div class="rounded border border-border bg-card p-4 shadow">
			<span>Please sign in</span>
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

			<!-- <pre>
{JSON.stringify($page.data, null, 2)}
			</pre> -->
		</div>
	{/if}
</div>
