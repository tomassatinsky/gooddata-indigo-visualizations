import { remove, cloneDeep, sortedUniq, clone, without, findIndex, omit, sortBy } from 'lodash';
import { getFooterHeight } from '../utils/footer';

export function getTotalsTypesList() {
    return [
        'sum',
        'max',
        'min',
        'avg',
        'med',
        'nat'
    ];
}

function getTotalsList(intl) {
    const types = getTotalsTypesList();

    return types.map(type => ({
        type,
        title: intl.formatMessage({ id: `visualizations.totals.funcTitle.${type}` }),
        alias: intl.formatMessage({ id: `visualizations.totals.funcAlias.${type}` })
    }));
}

export function getTotalsDatasource(usedTotals, intl) {
    const usedTotalsTypes = usedTotals.map(total => total.type);

    const list = getTotalsList(intl).map(total => ({
        ...total,
        disabled: usedTotalsTypes.includes(total.type)
    }));

    list.unshift({ title: 'visualizations.totals.dropdownHeading', role: 'header' });

    return {
        rowsCount: list.length,
        getObjectAt: index => list[index]
    };
}

export function getTotalFromListByType(totalItemType, intl) {
    const { alias, type } = getTotalsList(intl).find(total => total.type === totalItemType);

    return { alias, type, outputMeasureIndexes: [] };
}

export function orderTotals(totalsUnordered) {
    const types = getTotalsTypesList();
    return sortBy(totalsUnordered, total => types.indexOf(total.type));
}

export function toggleCellClass(parentReference, tableColumnIndex, state, className) {
    const cells = parentReference.querySelectorAll(`.col-${tableColumnIndex}`);

    cells.forEach((cell) => {
        if (state) {
            cell.classList.add(className);
        } else {
            cell.classList.remove(className);
        }
    });
}

export function resetRowClass(parentReference, className, selector, rowIndexToBeSet = null) {
    const rows = parentReference.querySelectorAll(selector);

    rows.forEach(r => r.classList.remove(className));

    if (rows.length && rowIndexToBeSet !== null) {
        const row = rows[rowIndexToBeSet];
        row.classList.add(className);
    }
}

export function isAddingMoreTotalsEnabled(addedTotals) {
    return addedTotals.length < getTotalsTypesList().length;
}

export function removeTotalsRow(totals, totalItemTypeToRemove) {
    const updatedTotals = cloneDeep(totals);

    remove(updatedTotals, total => total.type === totalItemTypeToRemove);

    return updatedTotals;
}

export function isTotalUsed(totals, totalItemType) {
    return totals.some(row => row.type === totalItemType);
}

export function addTotalsRow(intl, totals, totalItemTypeToAdd) {
    const updatedTotals = cloneDeep(totals);

    if (isTotalUsed(updatedTotals, totalItemTypeToAdd)) {
        return updatedTotals;
    }

    const total = getTotalFromListByType(totalItemTypeToAdd, intl);

    updatedTotals.push(total);

    return updatedTotals;
}

export function updateTotalsRemovePosition(tableBoundingRect, totals, isTotalsEditAllowed, removeWrapper) {
    if (!isTotalsEditAllowed) {
        return;
    }

    const translateY = tableBoundingRect.height - getFooterHeight(totals, isTotalsEditAllowed);

    /* eslint-disable no-param-reassign */
    removeWrapper.style.bottom = 'auto';
    removeWrapper.style.top = `${translateY}px`;
    /* eslint-enable no-param-reassign */
}

export function getAddTotalDropdownAlignPoints(isLastColumn = false) {
    return isLastColumn ?
        ({ align: 'tc br', offset: { x: 30, y: -3 } }) :
        ({ align: 'tc bc', offset: { x: 0, y: -3 } });
}

export function shouldShowAddTotalButton(column, isFirstColumn, addingMoreTotalsEnabled) {
    return !isFirstColumn && column.type === 'measure' && addingMoreTotalsEnabled;
}

export function getFirstMeasureIndex(headers) {
    const measureOffset = findIndex(headers, header => header.type === 'measure');

    return measureOffset === -1 ? 0 : measureOffset;
}

export function hasTableColumnTotalEnabled(outputMeasureIndexes, tableColumnIndex, firstMeasureIndex) {
    const index = tableColumnIndex - firstMeasureIndex;

    return outputMeasureIndexes && outputMeasureIndexes.includes(index);
}

export function addMeasureIndex(totals, headers, totalType, tableColumnIndex) {
    const index = tableColumnIndex - getFirstMeasureIndex(headers);

    return totals.map((total) => {
        if (total.type !== totalType) {
            return total;
        }

        const outputMeasureIndexes = clone(total.outputMeasureIndexes);
        outputMeasureIndexes.push(index);
        outputMeasureIndexes.sort();

        return {
            ...total,
            outputMeasureIndexes: sortedUniq(outputMeasureIndexes)
        };
    });
}

export function removeMeasureIndex(totals, headers, totalType, tableColumnIndex) {
    const index = tableColumnIndex - getFirstMeasureIndex(headers);

    return totals.map((total) => {
        if (total.type !== totalType) {
            return total;
        }

        const outputMeasureIndexes = without(total.outputMeasureIndexes, index);

        return {
            ...total,
            outputMeasureIndexes
        };
    });
}

export function getTotalsDefinition(totalsWithValues) {
    const totalsWithoutValues = totalsWithValues.map(total => omit(total, 'values'));
    return orderTotals(totalsWithoutValues);
}
