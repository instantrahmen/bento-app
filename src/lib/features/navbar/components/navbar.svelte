<script lang="ts">
	import type { User } from '@prisma/client';
	import type { Session } from '@auth/sveltekit';
	import { SignIn } from '@auth/sveltekit/components';
	import * as Avatar from '$lib/components/ui/avatar';
	import { getInitials } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import ThemePicker from '$features/themes/components/theme-picker.svelte';
	import Lightswitch from '$features/themes/components/light-switch.svelte';

	let {
		user,
		session,
	}: {
		user: User | null;
		session: Session | null;
	} = $props();
</script>

<nav
	class="fixed right-2 top-2 z-20 flex h-12 w-min flex-row items-center justify-end gap-2 rounded-md border bg-card bg-none p-2 shadow-md"
>
	<ThemePicker />
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
