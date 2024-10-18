import { readable, writable } from 'svelte/store';

/**
 * Wraps a function in a readable store so that it is reactive.
 *
 * **Must be used with Tanstack Query's `createQuery` since [it doesn't yet support Svelte 5](https://github.com/TanStack/query/issues/7227).**
 *
 * ### Usage:
 * ```ts
 * const query = createQuery(toReadable(() => ({
 *   queryKey: ["users", `search:${search}`],
 *   queryFn: () => fetch(`/users?search=${encodeURIComponent(search)}`)
 * })));
 * ```
 * Solution found here: https://github.com/TanStack/query/issues/7227#issuecomment-2050523804
 * @param cb The function to wrap.
 * @returns A readable store that calls the function on each subscription.
 */
export const toReadable = <T>(cb: () => T) => {
	const store = readable(cb(), (set) => {
		$effect.pre(() => set(cb()));
	});

	return store;
};

export const toWritable = <T>(cb: () => T) => {
	const store = writable<T>();
	$effect.pre(() => {
		store.set(cb());
	});
	return store;
};
