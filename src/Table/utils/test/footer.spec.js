import {
    getFooterHeight,
    getFooterPositions,
    isFooterAtDefaultPosition,
    isFooterAtEdgePosition
} from '../footer';

describe('Table utils - Footer', () => {
    describe('getFooterHeight', () => {
        it('should return proper height', () => {
            const totals = [
                { type: 'sum', outputMeasureIndexes: [] },
                { type: 'avg', outputMeasureIndexes: [] }
            ];
            expect(getFooterHeight(totals)).toEqual(60);
        });

        it('should return zero height when no totals are given', () => {
            const totals = [];
            expect(getFooterHeight(totals)).toEqual(0);
        });
    });

    describe('isFooterAtDefaultPosition', () => {
        const windowHeight = 500;

        it('should return true if footer is scrolled above the bottom of the viewport', () => {
            const tableBottom = 250;
            const hasHiddenRows = false;
            expect(isFooterAtDefaultPosition(hasHiddenRows, tableBottom, windowHeight))
                .toEqual(true);
        });

        it('should return true if footer is scrolled near the bottom of the viewport and table contains hidden rows', () => {
            const tableBottom = 510;
            const hasHiddenRows = true;
            expect(isFooterAtDefaultPosition(hasHiddenRows, tableBottom, windowHeight))
                .toEqual(true);
        });

        it('should return false if footer is scrolled near the bottom of the viewport and table has no hidden rows', () => {
            const tableBottom = 510;
            const hasHiddenRows = false;
            expect(isFooterAtDefaultPosition(hasHiddenRows, tableBottom, windowHeight))
                .toEqual(false);
        });


        it('should return false if footer is scrolled below the bottom of the viewport', () => {
            const tableBottom = 750;
            const hasHiddenRows = false;
            expect(isFooterAtDefaultPosition(hasHiddenRows, tableBottom, windowHeight))
                .toEqual(false);
        });
    });

    describe('isFooterAtEdgePosition', () => {
        const totals = [1, 2, 3];
        const hasHiddenRows = false;
        const windowHeight = 500;
        const totalsEditAllowed = false;

        it('should return true if footer is at its edge position', () => {
            const tableDimensions = {
                height: 500,
                bottom: 1000
            };
            expect(isFooterAtEdgePosition(hasHiddenRows, totals, windowHeight, totalsEditAllowed, tableDimensions))
                .toEqual(true);
        });

        it('should return false if footer is not at its edge position', () => {
            const tableDimensions = {
                height: 500,
                bottom: 100
            };
            expect(isFooterAtEdgePosition(hasHiddenRows, totals, windowHeight, totalsEditAllowed, tableDimensions))
                .toEqual(false);
        });
    });

    describe('getFooterPositions', () => {
        it('should return proper footer positions', () => {
            const totals = [1, 2, 3];
            let hasHiddenRows = true;
            let tableDimensions = {
                height: 300,
                bottom: 500
            };
            let windowHeight = 400;
            const totalsEditAllowed = false;

            expect(getFooterPositions(hasHiddenRows, totals, windowHeight, totalsEditAllowed, tableDimensions))
                .toEqual({
                    absoluteTop: -100,
                    defaultTop: -15,
                    edgeTop: -139,
                    fixedTop: 100
                });

            tableDimensions = {
                height: 500,
                bottom: 1000
            };
            windowHeight = 800;

            expect(getFooterPositions(hasHiddenRows, totals, windowHeight, totalsEditAllowed, tableDimensions))
                .toEqual({
                    absoluteTop: -200,
                    defaultTop: -15,
                    edgeTop: -339,
                    fixedTop: 300
                });

            expect(getFooterPositions(hasHiddenRows, totals, windowHeight, true, tableDimensions))
                .toEqual({
                    absoluteTop: -200,
                    defaultTop: -15,
                    edgeTop: -289,
                    fixedTop: 300
                });

            hasHiddenRows = false;
            tableDimensions = {
                height: 300,
                bottom: 100
            };
            windowHeight = 500;

            expect(getFooterPositions(hasHiddenRows, totals, windowHeight, totalsEditAllowed, tableDimensions))
                .toEqual({
                    absoluteTop: 400,
                    defaultTop: -0,
                    edgeTop: -154,
                    fixedTop: 200
                });
        });
    });
});
