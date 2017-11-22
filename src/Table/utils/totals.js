export function getTotalsFromConfig(config) {
    if (!config) { return []; }

    const { buckets } = config;

    if (buckets && buckets.totals) {
        return buckets.totals.map(total => total.total);
    }

    return [];
}