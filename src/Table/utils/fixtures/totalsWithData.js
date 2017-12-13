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

export const UNSORTED_TOTALS_DEFINITION = [{
    type: 'max',
    outputMeasureIndexes: [0],
}, {
    type: 'avg',
    alias: 'Avg of Something',
    outputMeasureIndexes: [0]
}, {
    type: 'nat',
    outputMeasureIndexes: [0]
}, {
    type: 'sum',
    alias: 'Sum of Something',
    outputMeasureIndexes: [0]
}, {
    type: 'min',
    outputMeasureIndexes: [0]
}, {
    type: 'med',
    outputMeasureIndexes: [0]
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

export const SORTED_EXECUTION_RESULT = {
    totals: [
        [
            [111],
            [222],
            [333],
            [444],
            [555],
            [666],
        ]
    ]
};