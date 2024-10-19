import type { ActionReturn } from 'svelte/action';

export interface PaginateOptions {
	page: number;
	perPage: number;
	totalPages: number;
	onPageChange: (newPage: number) => void;
	loadUp?: boolean;
}

export function scrollBehavior(
	node: HTMLElement,
	events: {
		onScrollBottom?: (node: HTMLElement, event: Event) => void;
		onScrollTop?: (node: HTMLElement, event: Event) => void;
	}
): ActionReturn {
	function handleScroll(event: Event) {
		const { scrollTop, clientHeight, scrollHeight } = node;
		if (scrollTop + clientHeight >= scrollHeight - 10) {
			if (events.onScrollBottom) events.onScrollBottom(node, event);
		}

		if (scrollTop <= 0) {
			if (events.onScrollTop) events.onScrollTop(node, event);
		}
	}

	node.addEventListener('scroll', handleScroll);

	return {
		destroy() {
			node.removeEventListener('scroll', handleScroll);
		},
	};
}
