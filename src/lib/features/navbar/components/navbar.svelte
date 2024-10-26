<script lang="ts">
	import type { User } from '@prisma/client';
	import type { Session } from '@auth/sveltekit';
	import { SignIn } from '@auth/sveltekit/components';
	import * as Avatar from '$lib/components/ui/avatar';
	import { cn, getInitials } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import ThemePicker from '$features/themes/components/theme-picker.svelte';
	import Lightswitch from '$features/themes/components/light-switch.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	let {
		user,
		session,
	}: {
		user: User | null;
		session: Session | null;
	} = $props();
</script>

<nav
	class={cn(
		'fixed right-2 top-2 z-10 flex h-12 w-min flex-row items-center justify-end gap-2  p-2'
	)}
>
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
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					variant="secondary"
					size="icon"
					class="rounded-full focus-visible:ring-4"
				>
					<Avatar.Root class="border">
						<Avatar.Image src={user.image} alt={user.name} />
						<Avatar.Fallback>
							{getInitials(user.name ?? 'User')}
						</Avatar.Fallback>
					</Avatar.Root>
					<span class="sr-only">Toggle user menu</span>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="flex flex-col gap-0">
				<DropdownMenu.Item href="/bento">Bentos</DropdownMenu.Item>

				<DropdownMenu.Item href="/settings">Settings</DropdownMenu.Item>

				<ThemePicker type="submenu" />

				<DropdownMenu.Separator />

				<DropdownMenu.Item asChild>
					<form action="/signout" method="POST">
						<Button type="submit" variant="ghost" class="w-full">Sign out</Button>
					</form>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/if}
</nav>
