import type { IconifyMetaDataCollection } from '@iconify/json';
import type { IconifyInfo } from '@iconify/types';

export type IconifyCollectionInfo = IconifyInfo & {
	id: string;
};

type IconsList = string[];

type CollectionsResponse = {
	collections: IconifyCollectionInfo[];
	page: number;
	perPage: number;
	totalPages: number;
	totalItems: number;
};

type CollectionsCache = {
	collections: IconifyCollectionInfo[];
	timestamp: number;
	ttl: number;
};

const collectionsInMemoryCache: Map<string, CollectionsCache> = new Map();

export const API_BASE = 'https://api.iconify.design';

const minutes = (n: number) => n * 60 * 1000;
const hours = (n: number) => minutes(n * 60);
const days = (n: number) => hours(n * 24);

function paginateArray<T>(array: T[], page: number, perPage: number): T[] {
	const startIndex = (page - 1) * perPage;
	const endIndex = startIndex + perPage;
	return array.slice(startIndex, endIndex);
}

export const getCollections = async (pagination: {
	page: number;
	perPage: number;
}): Promise<CollectionsResponse> => {
	const cachedCollections = collectionsInMemoryCache.get('/collections');
	if (cachedCollections && Date.now() - cachedCollections.timestamp < cachedCollections.ttl) {
		// return cachedCollections.collections;
		const paginatedCollections = paginateArray(
			cachedCollections.collections,
			pagination.page,
			pagination.perPage
		);

		return {
			collections: paginatedCollections,
			page: pagination.page,
			perPage: pagination.perPage,
			totalPages: Math.ceil(cachedCollections.collections.length / pagination.perPage),
			totalItems: cachedCollections.collections.length,
		};
	}

	const collections: IconifyMetaDataCollection = await fetch(`${API_BASE}/collections`, {
		cache: 'force-cache',
	}).then((r) => r.json());

	const collectionsArray: IconifyCollectionInfo[] = Object.entries(collections).map(
		([key, value]) => ({ id: key, ...value })
	);

	collectionsInMemoryCache.set('/collections', {
		collections: collectionsArray,
		timestamp: Date.now(),
		ttl: days(1),
	});

	const paginatedCollections = paginateArray(collectionsArray, pagination.page, pagination.perPage);

	return {
		collections: paginatedCollections,
		page: pagination.page,
		perPage: pagination.perPage,
		totalPages: Math.ceil(collectionsArray.length / pagination.perPage),
		totalItems: collectionsArray.length,
	};
};

export const getIconsInCollection = async (collection: string) => {
	const icons = await fetch(`${API_BASE}/collections/${collection}/icons`, {
		cache: 'force-cache',
		headers: {},
	}).then((r) => r.json());

	return icons;
};

/**
 * Search for icons by query.
 * @param params - Query Parameters.
 * @param params.query - Search query. Case insensitive.
 * @param params.prefixes - Comma separated list of icon set prefixes. You can use partial prefixes that end with "-", such as "mdi-" matches "mdi-light".
 */
export const searchIcons = async (params: { query: string; prefixes?: string }) => {
	return null;
};

export const getInitialIcons = async () => {
  const {collections} = await getCollections({ page: 1, perPage: 999 });

	const sampleIcons = collections.flatMap((collection) => collection.samples);

	return sampleIcons;
};
