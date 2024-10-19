type Shapes = {
	grid: string;
	xs: string;
	sm: string;
	md: string;
	lg: string;
	wide: string;
	tall: string;
};

export const shapesVariant1: Shapes = {
	grid: 'grid-cols-1 @xs:grid-cols-2 @sm:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5',
	xs: 'col-span-1 row-span-1',
	sm: 'col-span-1 row-span-1',
	md: 'col-span-2 row-span-2',
	lg: 'col-span-2 row-span-2',
	wide: 'col-span-1 row-span-2',
	tall: 'col-span-2 row-span-1',
};

export const shapesVariant2: Shapes = {
	grid: 'grid-cols-2 @sm:grid-cols-4 @3xl:grid-cols-10',
	// grid: 'grid-cols[repeat(auto-fit,minmax(rem,1fr))]',
	xs: 'col-span-1 row-span-1',
	sm: 'col-span-2 row-span-2',
	md: 'col-span-3 row-span-3',
	lg: 'col-span-4 row-span-4',
	wide: 'col-span-2 row-span-4',
	tall: 'col-span-2 row-span-2',
};

export const shapes: Shapes = { ...shapesVariant1 };
