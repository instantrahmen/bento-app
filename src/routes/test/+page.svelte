<script lang="ts">
	import { IconSelect } from '$lib/features/icon-select';
	import VirtualList from '$lib/components/virtual-list.svelte';
</script>

<div
	class="mt-12 flex w-full flex-1 flex-col gap-4 overflow-auto rounded-md border bg-card/50 p-4 shadow-md"
>
	<h1 class="text-3xl">Icon Select</h1>

	<IconSelect />
</div>

<style lang="postcss">
</style>
