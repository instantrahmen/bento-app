import Fuse, { type FuseOptionKey } from 'fuse.js';

export function fuzzySearch<T>(array: T[], keys: FuseOptionKey<T>[], search: string): T[] {
	if (!search) return array;
	const fuse = new Fuse(array, {
		keys: keys,
		isCaseSensitive: false,
		includeScore: true,
		minMatchCharLength: 3,
		useExtendedSearch: true,
	});

	return fuse.search(search).map((result) => result.item);
}
