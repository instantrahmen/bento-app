<script lang="ts" module>
	import ClickableCard from '$lib/components/clickable-card.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { BentoLink } from '@prisma/client';

	type SetEditingFn = (editing: boolean) => void;
	export type LinkCardProps = {
		link: BentoLink;
		onClick?: (e: Event, setEditing: SetEditingFn) => void;
		editing?: boolean;
		editable?: boolean;
		class?: string;
	};
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import { IconSelect } from '$features/icon-select';
	import { untrack } from 'svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import IconOrImage from '$lib/components/icon-or-image.svelte';
	import { cn } from '$lib/utils';

	let {
		link: initLink,
		onClick,
		editing = $bindable(false),
		editable = $bindable(false),
		class: className = '',
	}: LinkCardProps = $props();

	let link: BentoLink = $state(untrack(() => ({ ...initLink })));

	const saveLinkData = () => {
		console.log({ link });
		editing = false;
	};

	const setEditing = (newEditingValue: boolean) => {
		editing = newEditingValue;
	};

	const handleClick = (e: Event) => {
		if (onClick) {
			e.stopPropagation();
			e.preventDefault();
			onClick(e, setEditing);
		}
	};
</script>

<ClickableCard
	class={cn('absolute inset-0 h-full', className)}
	disabled={editing}
	href={link.url || undefined}
	onClick={handleClick}
>
	{#if editing}
		{@render bentoLinkEditable()}
	{:else}
		{#if link.icon}
			<IconOrImage src={link.icon} alt={link.title} />
		{/if}
		<h3 class="text-base font-semibold tracking-wide">{link.title}</h3>

		{#if editable}
			{@render actionButton({
				icon: 'lucide:pencil',
				onClick: () => {
					editing = true;
				},
			})}
		{/if}
	{/if}
</ClickableCard>

{#snippet actionButton({ icon, onClick }: { icon: string; onClick: (e: Event) => void })}
	<Button
		variant="ghost"
		size="icon"
		class="absolute right-2 top-2 text-card-foreground/90"
		on:click={(e) => {
			e.stopPropagation();
			e.preventDefault();
			onClick?.(e);
		}}
	>
		<Icon {icon} class="h-[1em] w-[1em]" />
	</Button>
{/snippet}

{#snippet bentoLinkEditable()}
	{@const key = `link-${link.id}`}
	{@render actionButton({
		icon: 'lucide:save',
		onClick: saveLinkData,
	})}

	{#if link.icon}
		<Icon icon={link.icon || ''} class="h-[1em] w-[1em] text-inherit" />
	{/if}
	<IconSelect bind:value={link.icon} />
	{@render input(['title', key])}
	{@render input(['url', key])}
{/snippet}

{#snippet input([name, key]: [keyof BentoLink, string])}
	<div class="flex w-full flex-col gap-2 @xs:flex-row @xs:items-center">
		<Label for={`${name}-${key}`} class="capitalize">{name}</Label>
		<Input
			id={`${name}-${key}`}
			class="w-full text-lg font-semibold"
			placeholder={link[name]}
			{name}
			bind:value={link[name]}
		/>
	</div>
{/snippet}
