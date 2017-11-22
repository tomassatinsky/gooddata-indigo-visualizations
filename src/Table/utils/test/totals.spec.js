import { getTotalsFromConfig } from '../totals';

describe('getTotalsFromConfig', () => {
    it('should handle missing config', () => {
        const totals = getTotalsFromConfig();
        expect(totals).toEqual([]);
    });

    it('should handle missing totals in buckets', () => {
        const totals = getTotalsFromConfig({ buckets: {}});
        expect(totals).toEqual([]);
    });

    it('should return totals from buckets, unwrapped', () => {
        const totals = getTotalsFromConfig({
            buckets: {
                totals: [
                    {
                        total: {
                            type: 'avg',
                            outputMeasureIndexes: []
                        }
                    }
                ]
            }
        });
        expect(totals).toEqual([{
            type: 'avg',
            outputMeasureIndexes: []
        }]);
    });
});