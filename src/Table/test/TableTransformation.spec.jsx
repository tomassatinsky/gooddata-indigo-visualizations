import React from 'react';
import { mount } from 'enzyme';
import { cloneDeep } from 'lodash';

import { withIntl } from '../../test/utils';
import TableTransformation from '../TableTransformation';
import {
    EXECUTION_REQUEST_2A_3M,
    EXECUTION_RESPONSE_2A_3M,
    EXECUTION_RESULT_2A_3M
} from '../fixtures/2attributes3measures';
import { config } from '../../test/fixtures';

const WrappedTable = withIntl(TableTransformation);

describe('TableTransformation', () => {
    function createComponent(customProps = {}) {
        const defaultProps = {
            executionRequest: EXECUTION_REQUEST_2A_3M,
            executionResponse: EXECUTION_RESPONSE_2A_3M,
            executionResult: EXECUTION_RESULT_2A_3M
        };
        const props = { ...defaultProps, ...customProps };
        return <WrappedTable {...props} />;
    }

    it('should use default renderer', () => {
        const wrapper = mount(createComponent());
        const component = wrapper.find(TableTransformation);
        expect(component.prop('tableRenderer')).toBeDefined();
    });

    it('should use custom renderer', () => {
        const tableRenderer = jest.fn().mockImplementation(() => <div />);
        mount(createComponent({ tableRenderer }));
        expect(tableRenderer).toHaveBeenCalled();
    });

    it('should pass containerHeight if height is set in props', () => {
        const tableRenderer = jest.fn().mockImplementation(() => <div />);
        mount(createComponent({ tableRenderer, height: 255 }));
        expect(tableRenderer.mock.calls[0][0].containerHeight).toEqual(255);
    });

    it('should pass containerWidth if width is set in props', () => {
        const tableRenderer = jest.fn().mockImplementation(() => <div />);
        mount(createComponent({ tableRenderer, width: 700 }));
        expect(tableRenderer.mock.calls[0][0].containerWidth).toEqual(700);
    });

    it('should pass totals obtained from config property', () => {
        const tableRenderer = jest.fn().mockImplementation(() => <div />);

        const configWithTotals = cloneDeep(config);
        configWithTotals.buckets.totals = [{
            total: {
                type: 'sum',
                alias: 'Suma',
                outputMeasureIndexes: [1]
            }
        }];

        mount(createComponent({ tableRenderer, config: configWithTotals }));
        expect(tableRenderer.mock.calls[0][0].totals).toEqual([{
            type: 'sum',
            alias: 'Suma',
            outputMeasureIndexes: [1]
        }]);
    });
});
