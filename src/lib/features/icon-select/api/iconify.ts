import type { APIv2CollectionResponse } from '../types/iconify';

export const API_BASE = 'https://api.iconify.design';

export const getCollections = async () => {
	const collections = await fetch(`${API_BASE}/collections`, {
		cache: 'force-cache',
	}).then((r) => r.json());

	return collections;
};

export const searchIcons = async (params: { query: string; prefixes?: string }) => {
	return null;
};

// const iconNameToFullName = (icon: string) => `${prefix}:${icon}`;
const iconOption = (icon: string) => ({
	label: icon,
	value: icon,
});

export const getCollectionIconsSet = async (prefix: string = 'mdi') => {
	const apiUrl = new URL(`${API_BASE}/collection`);
	apiUrl.searchParams.append('prefix', prefix);
	const collection: APIv2CollectionResponse = await fetch(apiUrl).then((r) => r.json());
	const { uncategorized = [], categories = {} } = collection;

	const iconNameToFullName = (icon: string) => `${prefix}:${icon}`;

	const allIcons = new Set(
		[...uncategorized, ...[...Object.values(categories).flat()]].map(iconNameToFullName)
	);

	return Array.from(allIcons);
};

export const getCollectionIcons = async (prefix: string = 'mdi') => {
	const allIcons = await getCollectionIconsSet(prefix);

	return Array.from(allIcons).map((icon) => iconOption(icon));
};

export const getMultipleCollectionsIcons = async (prefixes: string[] = ['mdi']) => {
	const collections = await Promise.all(prefixes.map((prefix) => getCollectionIconsSet(prefix)));

	// remove any possible duplicates by creating a set from the flattened array
	const iconsSet = new Set(collections.flat());

	return Array.from(iconsSet).map((icon) => iconOption(icon));
};
