import type { IconifyMetaDataCollection } from '@iconify/json';
import type { IconifyInfo } from '@iconify/types';
import type { APIv2CollectionResponse } from '../types/iconify';
import { list } from 'postcss';
import { get } from 'svelte/store';

export const API_BASE = 'https://api.iconify.design';

export const getIconsInCollection = async (collection: string) => {
	const icons = await fetch(`${API_BASE}/collections/${collection}/icons`, {
		cache: 'force-cache',
		headers: {},
	}).then((r) => r.json());

	return icons;
};

export const searchIcons = async (params: { query: string; prefixes?: string }) => {
	return null;
};

export const getCollectionIcons = async (prefix: string = 'mdi') => {
	const apiUrl = new URL(`${API_BASE}/collection`);
	apiUrl.searchParams.append('prefix', prefix);

	const collection: APIv2CollectionResponse = await fetch(apiUrl).then((r) => r.json());

	const { uncategorized = [], categories = {} } = collection;

	// To get a list of all icon names that should be shown, use the following logic:

	// Get values from uncategorized property, if it exists.
	// Traverse all categories from categories property, if it exists. One icon can exist in multiple categories, so check for duplicates, the easiest way to do that is to use Set class in JavaScript instead of Array.

	const iconNameToFullName = (icon: string) => `${prefix}:${icon}`;
	const iconOption = (icon: string) => ({
		label: icon,
		value: iconNameToFullName(icon),
	});
	const allIcons = new Set([
		...uncategorized.map(iconOption),
		...[...Object.values(categories).flat()].map(iconOption),
	]);

	return Array.from(allIcons);
};
