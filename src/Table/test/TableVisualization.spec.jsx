import React from 'react';
import { mount } from 'enzyme';
import { Table } from 'fixed-data-table-2';

import TableVisualization, { DEFAULT_FOOTER_ROW_HEIGHT } from '../TableVisualization';
import { withIntl } from '../../test/utils';
import { ASC, DESC } from '../constants/sort';
import { EXECUTION_REQUEST_1A_2M, TABLE_HEADERS_1A_2M, TABLE_ROWS_1A_2M } from '../fixtures/1attribute2measures';
import { EXECUTION_REQUEST_2M, TABLE_HEADERS_2M, TABLE_ROWS_2M } from '../fixtures/2measures';
import AddTotal from '../Totals/AddTotal';
import RemoveRows from '../Totals/RemoveRows';
import { EXECUTION_REQUEST_2A_3M, TABLE_HEADERS_2A_3M, TABLE_ROWS_2A_3M } from '../fixtures/2attributes3measures';

function getInstanceFromWrapper(wrapper, component) {
    return wrapper.find(component).childAt(0).instance();
}

const WrappedTable = withIntl(TableVisualization);

describe('Table', () => {
    function renderTable(customProps = {}) {
        const props = {
            containerWidth: 600,
            containerHeight: 400,
            rows: TABLE_ROWS_1A_2M,
            headers: TABLE_HEADERS_1A_2M,
            executionRequest: EXECUTION_REQUEST_1A_2M,
            ...customProps
        };

        return mount(
            <WrappedTable {...props} />
        );
    }

    it('should fit container dimensions', () => {
        const wrapper = renderTable();
        expect(wrapper.find(Table).prop('width')).toEqual(600);
        expect(wrapper.find(Table).prop('height')).toEqual(400);
    });

    it('should render column headers', () => {
        const wrapper = renderTable();
        expect(wrapper.find(Table).prop('children')).toHaveLength(3);
    });

    it('should align measure columns to the right', () => {
        const wrapper = renderTable();
        const columns = wrapper.find(Table).prop('children');
        expect(columns[0].props.align).toEqual('left');
        expect(columns[1].props.align).toEqual('right');
        expect(columns[2].props.align).toEqual('right');
    });

    it('should distribute width evenly between columns', () => {
        const wrapper = renderTable();
        const columns = wrapper.find(Table).prop('children');
        expect(columns[0].props.width).toEqual(200);
    });

    describe('renderers', () => {
        function renderCell(wrapper, columnKey) {
            const columns = wrapper.find(Table).prop('children');
            const cell = columns[columnKey].props.cell({ rowIndex: 0, columnKey });
            return cell.props.children;
        }

        it('should format measures', () => {
            const wrapper = renderTable();
            const span = renderCell(wrapper, 2);
            const spanContent = span.props.children;
            expect(spanContent).toEqual('1,324');
            expect(span.props.style.color).toEqual('#FF0000');
        });

        it('should render attributes as strings', () => {
            const wrapper = renderTable();
            const span = renderCell(wrapper, 0);
            const spanContent = span.props.children;
            expect(spanContent).toEqual('Wile E. Coyote');
            expect(span.props.style).toEqual({});
        });

        it('should render title into header', () => {
            const wrapper = renderTable();
            expect(wrapper.find('.gd-table-header-title').first().text()).toEqual('Name');
        });

        it('should bind onclick when cell drillable', () => {
            const wrapper = renderTable({ drillableItems: [{ uri: '/gdc/md/project_id/obj/1st_measure_uri_id' }] });
            const columns = wrapper.find(Table).prop('children');
            const cell = columns[1].props.cell({ rowIndex: 0, columnKey: 1 });

            expect(cell.props).toHaveProperty('onClick', expect.any(Function));
        });

        it('should not bind onclick when cell not drillable', () => {
            const wrapper = renderTable({ drillableItems: [{ uri: '/gdc/md/project_id/obj/unknown_measure_uri_id' }] });
            const columns = wrapper.find(Table).prop('children');
            const cell = columns[1].props.cell({ rowIndex: 0, columnKey: 1 });

            expect(cell.props).not.toHaveProperty('onClick', expect.any(Function));
        });
    });

    describe('sort', () => {
        describe('default header renderer', () => {
            it('should render up arrow', () => {
                const wrapper = renderTable({ sortBy: 0, sortDir: ASC });
                const columns = wrapper.find(Table).prop('children');
                const header = columns[0].props.header({ columnKey: 0 });
                const sort = header.props.children[1];

                expect(sort.props.className).toContain('gd-table-arrow-up');
                expect(sort.props.className).toContain('s-sorted-asc');
            });

            it('should render down arrow', () => {
                const wrapper = renderTable({ sortBy: 0, sortDir: DESC });
                const columns = wrapper.find(Table).prop('children');
                const header = columns[0].props.header({ columnKey: 0 });
                const sort = header.props.children[1];

                expect(sort.props.className).toContain('gd-table-arrow-down');
                expect(sort.props.className).toContain('s-sorted-desc');
            });

            it('should render arrow on second column', () => {
                const wrapper = renderTable({ sortBy: 1, sortDir: ASC });
                const columns = wrapper.find(Table).prop('children');
                const header = columns[1].props.header({ columnKey: 0 });
                const sort = header.props.children[1];

                expect(sort.props.className).toContain('gd-table-arrow-up');
                expect(sort.props.className).toContain('s-sorted-asc');
            });

            it('should not render arrow if sort info is missing', () => {
                const wrapper = renderTable({ sortBy: 0, sortDir: null });
                const columns = wrapper.find(Table).prop('children');
                const header = columns[0].props.header({ columnKey: 0 });
                const sort = header.props.children[1];

                expect(sort.props.className).toEqual('');
            });
        });

        describe('tooltip header renderer', () => {
            it('should render title into header', () => {
                const wrapper = renderTable({ sortInTooltip: true });

                wrapper.find('.gd-table-header-title').first().simulate('click');

                const bubble = document.querySelector('.gd-table-header-bubble');
                expect(bubble).toBeDefined();

                // work-around to handle overlays
                document.body.innerHTML = '';
            });
        });
    });

    describe('table footer and totals', () => {
        const TOTALS = [
            {
                type: 'sum',
                values: [null, null, 125]
            }, {
                type: 'avg',
                values: [null, 45.98, 12.32]
            }, {
                type: 'nat',
                values: [null, 12.99, 1.008]
            }
        ];
        const DATA_2A_3M = {
            rows: TABLE_ROWS_2A_3M,
            headers: TABLE_HEADERS_2A_3M,
            executionRequest: EXECUTION_REQUEST_2A_3M
        };

        describe('totals edit not allowed', () => {
            it('should not render any footer cells when no totals are provided', () => {
                const wrapper = renderTable(DATA_2A_3M);

                expect(wrapper.find('.indigo-table-footer-cell').length).toEqual(0);
            });

            it('should not render any footer cells when totals are provided but data contains only measures', () => {
                const wrapper = renderTable({
                    totals: TOTALS,
                    headers: TABLE_HEADERS_2M,
                    rows: TABLE_ROWS_2M,
                    executionRequest: EXECUTION_REQUEST_2M
                });

                expect(wrapper.find('.indigo-table-footer-cell').length).toEqual(0);
            });

            it('should not render footer cells when totals are provided but there is only row in data', () => {
                const wrapper = renderTable({
                    totals: TOTALS,
                    rows: TABLE_ROWS_1A_2M,
                    headers: TABLE_HEADERS_1A_2M,
                    executionRequest: EXECUTION_REQUEST_1A_2M
                });

                expect(wrapper.find('.indigo-table-footer-cell').length).toEqual(0);
            });

            it('should render footer cells when totals are provided', () => {
                const wrapper = renderTable({
                    totals: TOTALS,
                    ...DATA_2A_3M
                });

                expect(wrapper.find('.indigo-table-footer-cell').length).toEqual(15);
            });

            it('should reset footer when component is updated with no totals', () => {
                const wrapper = renderTable({
                    totals: TOTALS,
                    ...DATA_2A_3M
                });

                const footer = getInstanceFromWrapper(wrapper, TableVisualization).footer;

                expect(footer.classList.contains('table-footer')).toBeTruthy();

                wrapper.setProps({ totals: [] });

                expect(footer.classList.contains('table-footer')).toBeFalsy();
            });

            it('should update footer height when component is updated with different totals', () => {
                const wrapper = renderTable({
                    totals: TOTALS,
                    ...DATA_2A_3M
                });
                const footer = getInstanceFromWrapper(wrapper, TableVisualization).footer;

                const heightBefore = TOTALS.length * DEFAULT_FOOTER_ROW_HEIGHT;

                expect(footer.style.height).toEqual(`${heightBefore}px`);

                const totalsAfter = [...TOTALS, {
                    name: 'Other',
                    values: [1, 2, 3]
                }];
                const heightAfter = totalsAfter.length * DEFAULT_FOOTER_ROW_HEIGHT;

                wrapper.setProps({ totals: totalsAfter });

                expect(footer.style.height).toEqual(`${heightAfter}px`);
            });

            it('should not render add total buttons', () => {
                const wrapper = renderTable({
                    totalsEditAllowed: false,
                    ...DATA_2A_3M
                });

                expect(wrapper.find(AddTotal).length).toEqual(0);
            });

            it('should not render remove buttons when totals are provided', () => {
                const wrapper = renderTable({
                    totals: TOTALS,
                    totalsEditAllowed: false,
                    ...DATA_2A_3M
                });

                expect(wrapper.find(RemoveRows).length).toEqual(0);
            });
        });

        describe('totals edit allowed', () => {
            it('should render footer cells for add buttons into all columns', () => {
                const wrapper = renderTable({
                    totalsEditAllowed: true,
                    ...DATA_2A_3M
                });

                expect(wrapper.find('.indigo-table-footer-cell.indigo-totals-add-cell').length).toEqual(5);
            });

            it('should render add totals buttons into all measure columns except first no matter of type', () => {
                const wrapper = renderTable({
                    totalsEditAllowed: true,
                    ...DATA_2A_3M
                });

                expect(wrapper.find(AddTotal).length).toEqual(3);
            });

            it('should set editable class name to table', () => {
                const wrapper = renderTable({
                    totalsEditAllowed: true,
                    ...DATA_2A_3M
                });

                expect(wrapper.find('.indigo-table-component.has-footer-editable').length).toEqual(1);
            });

            it('should render remove buttons when totals are provided', () => {
                const wrapper = renderTable({
                    totals: TOTALS,
                    totalsEditAllowed: true,
                    ...DATA_2A_3M
                });

                expect(wrapper.find(RemoveRows).length).toEqual(1);
            });

            it('should bind mouse events on table body cells', () => {
                const wrapper = renderTable({
                    totals: TOTALS,
                    totalsEditAllowed: true,
                    ...DATA_2A_3M
                });
                const component = wrapper.find(TableVisualization).childAt(0).instance();
                const cell = wrapper.find('.fixedDataTableCellLayout_wrap1.col-2').at(0);

                component.toggleFooterColumnHighlight = jest.fn();

                cell.simulate('mouseEnter');

                expect(component.toggleFooterColumnHighlight).toBeCalledWith(true, 2);

                cell.simulate('mouseLeave');

                expect(component.toggleFooterColumnHighlight).toBeCalledWith(false, 2);
            });

            it('should bind mouse events on table footer cells', () => {
                const wrapper = renderTable({
                    totals: TOTALS,
                    totalsEditAllowed: true,
                    ...DATA_2A_3M
                });
                const component = wrapper.find(TableVisualization).childAt(0).instance();
                const cell = wrapper.find('.indigo-table-footer-cell.col-2').at(0);

                component.resetTotalsRowHighlight = jest.fn();
                component.toggleFooterColumnHighlight = jest.fn();

                cell.simulate('mouseEnter');

                expect(component.resetTotalsRowHighlight).toBeCalledWith(0);
                expect(component.toggleFooterColumnHighlight).toBeCalledWith(true, 2);

                cell.simulate('mouseLeave');

                expect(component.resetTotalsRowHighlight).toBeCalled();
                expect(component.toggleFooterColumnHighlight).toBeCalledWith(false, 2);
            });
        });
    });
});
