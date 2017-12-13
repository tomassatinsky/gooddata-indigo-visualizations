export const TOTALS_DEFINITION = [{
    type: 'sum',
    outputMeasureIndexes: [],
    alias: 'Sum of Something'
}, {
    type: 'avg',
    outputMeasureIndexes: [1],
    alias: 'Avg of Something'
}, {
    type: 'nat',
    outputMeasureIndexes: [0, 1]
}];

export const PARTIAL_EXECUTION_RESULT = {
    totals: [
        [
            [111, 222],
            [333, 444],
            [555, 666],
        ]
    ]
};