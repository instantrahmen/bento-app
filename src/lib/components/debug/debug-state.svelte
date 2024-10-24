<script lang="ts" generics="T = unknown">
	import { codeToHtml } from 'shiki';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';

	let { state: _state, name = 'View State' }: { state: T; name?: string } = $props();

	let code = $derived(JSON.stringify(_state, null, 2));
	let html: string = $state('');

	const setHtml = async () => {
		html = await codeToHtml(code, {
			lang: 'jsonc',
			theme: 'catppuccin-mocha',
		});
	};
	$effect(() => {
		setHtml();
	});
</script>

<!-- {@html html} -->

<Collapsible.Root class="w-full max-w-2xl space-y-2">
	<div class="mt-2 flex items-center justify-between gap-2 space-x-4 p-0">
		<Collapsible.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="ghost"
				size="lg"
				class=" flex w-full max-w-96 justify-between p-2"
			>
				<span class="">Toggle</span>
				<CaretSort class="h-4 w-4" />
			</Button>
		</Collapsible.Trigger>
	</div>
	<Collapsible.Content class="space-y-2">
		<div class="max-h-96 overflow-auto rounded-md border p-0 font-mono text-sm [&>pre]:p-4">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html html}
		</div>
	</Collapsible.Content>
</Collapsible.Root>

<style lang="postcss">
</style>
