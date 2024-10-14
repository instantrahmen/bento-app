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
		console.log('scrolling', {
			scrollTop,
			clientHeight,
			sum: scrollTop + clientHeight,
			scrollHeight,
		});
		if (scrollTop + clientHeight >= scrollHeight - 10) {
			console.log('[use:autoPaginate] hit bottom');
			if (events.onScrollBottom) events.onScrollBottom(node, event);
		}

		if (scrollTop <= 0) {
			console.log('[use:autoPaginate] hit top');
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
