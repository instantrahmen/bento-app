export const debounce = <T extends (...args: any[]) => void>(
	callback: T,
	delay: number
): ((...args: Parameters<T>) => void) => {
	let timeoutId: Timer | null = null;

	return (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			callback(...args);
			timeoutId = null;
		}, delay);
	};
};
