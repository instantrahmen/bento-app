<script lang="ts">
	import { Command as CommandPrimitive } from 'cmdk-sv';
	import { cn } from '$lib/utils/shadcn.js';
	type Props = CommandPrimitive.GroupProps & {
		this?: HTMLDivElement | null;
	};

	let { class: className, children, this: self = $bindable(null), ...restProps }: Props = $props();
</script>

<CommandPrimitive.Group asChild>
	<div
		bind:this={self}
		class={cn(
			'overflow-visible p-0 text-foreground [&_[data-cmdk-group-heading]]:px-2 [&_[data-cmdk-group-heading]]:py-1.5 [&_[data-cmdk-group-heading]]:text-xs [&_[data-cmdk-group-heading]]:font-medium [&_[data-cmdk-group-heading]]:text-muted-foreground',
			className
		)}
		{...restProps}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
</CommandPrimitive.Group>
