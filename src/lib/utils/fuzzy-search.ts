export function fuzzySearch<T>(array: T[], keys: (keyof T)[], search: string): T[] {
	const lowerCaseSearch = search.toLowerCase();

	return array.filter((item) => {
		return keys.some((key) => {
			const value = item[key];

			if (typeof value === 'string') {
				return value.toLowerCase().includes(lowerCaseSearch);
			}

			return false;
		});
	});
}
