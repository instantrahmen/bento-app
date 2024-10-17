<script lang="ts">
	import Lightswitch from '$lib/components/light-switch.svelte';
	import { SignIn } from '@auth/sveltekit/components';
	import * as Avatar from '$lib/components/ui/avatar';
	import { getInitials } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import type { User } from '@prisma/client';
	import type { Session } from '@auth/sveltekit';

	let {
		user,
		session,
	}: {
		user: User | null;
		session: Session | null;
	} = $props();
</script>

<nav class=" fixed flex h-12 w-full flex-row items-center justify-end gap-2 bg-none p-2">
	<Lightswitch />
	{#if !session?.user || !user}
		<div class="actions">
			<SignIn provider="discord">
				<div slot="submitButton" class={buttonVariants({ variant: 'default' })}>
					Sign in with Discord
				</div>
			</SignIn>
		</div>
	{:else}
		<Avatar.Root class="border">
			<Avatar.Image src={user.image} alt={user.name} />
			<Avatar.Fallback>
				{getInitials(user.name ?? 'User')}
			</Avatar.Fallback>
		</Avatar.Root>
	{/if}
</nav>
