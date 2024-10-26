<script lang="ts">
	import type { UserSettings } from '@prisma/client';
	import type { APIGetUsersMeResponse } from '$features/auth/types';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { untrack } from 'svelte';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from '$lib/components/ui/card';

	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { queries } from '$features/auth/api/queries';
	import { queries as settingsQueries } from '$features/settings/api/queries';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import EditableField from '$lib/components/form/editable-field.svelte';

	const queryClient = useQueryClient();
	let {
		authData,
	}: {
		authData: APIGetUsersMeResponse;
	} = $props();

	const settingsQuery = createQuery(
		toReadable(() => settingsQueries.settings({ userId: authData?.user?.id }))
	);

	const userQuery = createQuery(toReadable(() => ({ ...queries.me({}), initialData: authData })));

	const settingsMutation = createMutation({
		mutationFn: async (data: Partial<UserSettings>) => {
			await fetch('/api/settings', {
				method: 'PUT',
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries(settingsQueries.settings({ userId: authData?.user?.id }));
		},
	});

	const userMutation = createMutation({
		mutationFn: async (data: Partial<APIGetUsersMeResponse['user']>) => {
			await fetch('/api/users/me', {
				method: 'PUT',
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queries.me({}).queryKey });
		},
	});

	let userData = $derived($userQuery.data || authData);

	const handleSaveName = (newName: string) => {
		$userMutation.mutate({ name: newName });
	};

	let openLinksInNewTab = $state(untrack(() => $settingsQuery.data?.openLinksInNewTab || false));

	$effect(() => {
		if ($settingsQuery.isFetching || $settingsQuery.isLoading) {
			return;
		}
		openLinksInNewTab = $settingsQuery.data?.openLinksInNewTab || false;
	});
</script>

<div class="container mx-auto py-10">
	<h2 class="mb-6 text-3xl font-bold">Account Settings</h2>
	<Tabs class="w-full">
		<TabsList class="mb-4">
			<TabsTrigger value="profile">Profile</TabsTrigger>
			<TabsTrigger value="bentos">Bentos</TabsTrigger>
		</TabsList>
		<TabsContent value="profile">
			<Card>
				<CardHeader class="text-center">
					<CardTitle>Profile Information</CardTitle>
					<CardDescription>Update your profile details here.</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="flex items-center justify-center space-x-4">
						<Avatar class="h-20 w-20">
							<AvatarImage src={userData.user?.image} alt="Profile picture" />
							<AvatarFallback>JD</AvatarFallback>
						</Avatar>
					</div>
					<EditableField label="Name" value={userData.user?.name || ''} onSave={handleSaveName} />
					<div class="grid w-full items-center gap-1.5">
						<Label for="bio">Bio</Label>
						<textarea
							id="bio"
							placeholder="Tell us about yourself"
							class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						></textarea>
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<TabsContent value="bentos">
			<Card>
				<CardHeader>
					<CardTitle>Bento Settings</CardTitle>
					<CardDescription>Manage your bento settings.</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="flex items-center justify-between">
						<Label for="email-notifications" class="flex flex-col space-y-1">
							<span>Open Links in New Tab</span>
							<span class="text-sm font-normal text-muted-foreground"
								>Open external links in a new tab instead of the current tab.</span
							>
						</Label>
						{#if !$settingsQuery.isLoading || !$settingsQuery.isFetching}
							<Switch
								id="open-in-new-tab"
								bind:checked={openLinksInNewTab}
								onCheckedChange={(checked) => {
									openLinksInNewTab = checked;
									$settingsMutation.mutate({ openLinksInNewTab });
								}}
							/>
						{:else}
							<iconify-icon
								icon="mdi:loading"
								width="1.5em"
								height="1.5em"
								class="h-[1.5em] w-[1.5em] animate-spin"
							></iconify-icon>
						{/if}
					</div>
				</CardContent>
			</Card>
		</TabsContent>
	</Tabs>
</div>
