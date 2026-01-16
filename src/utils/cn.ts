export function cn(...classes: (string | boolean | Record<string, boolean> | undefined | null)[]): string {
    return classes
        .flatMap(cls => {
            if (typeof cls === 'string') return cls;
            if (typeof cls === 'boolean' || cls === null || cls === undefined) return [];
            if (typeof cls === 'object') {
                return Object.entries(cls)
                    .filter(([_, value]) => value)
                    .map(([key]) => key);
            }
            return [];
        })
        .filter(Boolean)
        .join(' ');
}