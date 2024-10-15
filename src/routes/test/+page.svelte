<script lang="ts">
	import { IconSelect } from '$lib/features/icon-select';
	import VirtualList from '$lib/components/virtual-list.svelte';
</script>

<div
	class="mt-12 flex w-full flex-1 flex-col gap-4 overflow-auto rounded-md border bg-card/50 p-4 shadow-md"
>
	<h1 class="text-3xl">Icon Select</h1>
	<!-- <VirtualList count={40000} let:row containerClass="bg-red-500 h-96 " class="h-96">
		{@const { index } = row}

		<div class="text-2xl">{index}</div>
	</VirtualList> -->
	<IconSelect
		iconSets={[
			'radix-icons',
			'lucide',
			'mdi',
			'cib',
			'simple-icons',
			'fa-brands',
			'fa',
			'fa6',
			'fa6-solid',
			'fa6-brands',
			'fe',
			'cbi',
			'logos',
			'bxl',
		]}
	/>
</div>

<style lang="postcss">
</style>
