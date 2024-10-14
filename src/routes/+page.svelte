<script lang="ts">
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils/shadcn';
	import { buttonVariants } from '$lib/components/ui/button';

	let { data } = $props();
</script>

<h2 class="text-3xl font-semibold">Bento App</h2>
<div>
	{#if data.session}
		{#if data.session.user?.image}
			<img src={data.session.user.image} class="avatar" alt="User Avatar" />
		{/if}
		<span class="signedInText">
			<small>Signed in as</small><br />
			<strong>{data.session.user?.name ?? 'User'}</strong>
		</span>
		<SignOut>
			<div slot="submitButton" class="buttonPrimary">Sign out</div>
		</SignOut>

		{#if data.user}
			<div class="rounded border border-border bg-card p-4 shadow">
				<Button variant="outline" href="/bento">Bentos</Button>
				<Button variant="outline" href="/test">Test Page</Button>
			</div>
			<!-- <pre>
{JSON.stringify(data.user, null, 2)}
			</pre> -->
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
