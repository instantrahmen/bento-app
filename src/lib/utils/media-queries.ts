import { browser } from '$app/environment';

export type MediaQuery = {
	min: number;
	max?: number;
	queryString: string;
	queryStringMin: string;
	queryStringMax: string;
	matches: boolean;
};

const createMediaQuery = (min: number, max?: number): MediaQuery => {
	return {
		min,
		max,
		get queryString() {
			return `(min-width: ${min}px)${max ? ` and (max-width: ${max}px)` : ''}`;
		},
		get queryStringMin() {
			return `(min-width: ${min}px)`;
		},
		get queryStringMax() {
			if (!max) return '';
			return `(max-width: ${max}px)`;
		},
		get matches() {
			if (browser) return window.matchMedia(this.queryString).matches;
			return false;
		},
	};
};

export const media: Record<string, MediaQuery> = {
	xs: createMediaQuery(0, 639),
	sm: createMediaQuery(640, 767),
	md: createMediaQuery(768, 1023),
	lg: createMediaQuery(1024, 1279),
	xl: createMediaQuery(1280, 1535),
	'2xl': createMediaQuery(1536),
};
