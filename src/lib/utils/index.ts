export * from './debounce';
export * from './fuzzy-search';
export * from './paginate';
export * from './shadcn';

export const slugify = (text: string) => {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
};

/**
 * Checks if a given string is a valid URL by verifying if it starts with "http:" or "https:".
 *
 * @param url The URL to be validated.
 * @returns A boolean indicating whether the URL is valid or not.
 */
export const stringIsValidUrl = (url: string): boolean => {
	try {
		const urlObj = new URL(url);
		return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
	} catch {
		return false;
	}
};

/**
 * Given an iconify name like `mdi:home`, returns the name of the icon after the prefix, in this case "home".
 * @param icon The full icon name, e.g. "mdi:home".
 * @returns The name of the icon after the prefix, e.g. "home".
 */
export const getIconName = (icon: string = '') => {
	if (!icon?.includes(':')) return icon;
	const [_, iconName] = icon.split(':');
	return iconName;
};

/**
 * Extracts the initials from a given name using valid separators: " ", "-", ".", "_"
 */
export const getInitials = (name: string = '') => {
	if (!name) return '';
	return name
		.split(/[\s-_.]+/)
		.map((n) => n[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();
};
