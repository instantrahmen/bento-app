export const paginate = <T>(array: T[], pageSize: number) => {
	return array.reduce((pages, item, index) => {
		const page = Math.floor(index / pageSize);
		pages[page] = pages[page] || [];
		pages[page].push(item);
		return pages;
	}, [] as T[][]);
};
