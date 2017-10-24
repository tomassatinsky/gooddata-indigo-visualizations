import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';

import List from '@gooddata/goodstrap/lib/List/List';
import Dropdown, { DropdownBody } from '@gooddata/goodstrap/lib/Dropdown/Dropdown';

import { TOTALS_TYPES_DROPDOWN_WIDTH } from '../TableVisualization';
import DropdownItem from './DropdownItem';
import TableTotalsAddButton from './AddTotalButton';
import { getAddTotalDropdownAlignPoints, shouldShowAddTotalButton } from './utils';

export default class AddTotal extends Component {
    static propTypes = {
        dataSource: PropTypes.object.isRequired,
        header: PropTypes.object.isRequired,
        index: PropTypes.number.isRequired,
        headersCount: PropTypes.number.isRequired,
        addingMoreTotalsEnabled: PropTypes.bool.isRequired,
        onDropdownOpenStateChanged: PropTypes.func,
        onWrapperHover: PropTypes.func,
        onButtonHover: PropTypes.func,
        onAddTotalsRow: PropTypes.func
    };

    static defaultProps = {
        onDropdownOpenStateChanged: noop,
        onWrapperHover: noop,
        onButtonHover: noop,
        onAddTotalsRow: noop
    };

    constructor() {
        super();

        this.setWrapperRef = this.setWrapperRef.bind(this);
    }

    onOpenStateChanged(opened, index) {
        this.props.onDropdownOpenStateChanged(opened, index);

        if (opened) {
            this.wrapperRef.classList.add('dropdown-active');
        } else {
            this.wrapperRef.classList.remove('dropdown-active');
        }
    }

    setWrapperRef(ref) {
        this.wrapperRef = ref;
    }

    render() {
        const {
            dataSource,
            header,
            index,
            headersCount,
            onAddTotalsRow,
            onWrapperHover,
            onButtonHover,
            addingMoreTotalsEnabled
        } = this.props;

        const isFirstColumn = (index === 0);
        const isLastColumn = (index === headersCount - 1);

        const showAddTotalButton = shouldShowAddTotalButton(header, isFirstColumn, addingMoreTotalsEnabled);
        const dropdownAlignPoint = getAddTotalDropdownAlignPoints(isLastColumn);

        const dropdownBodyClassName = classNames({
            'arrow-align-right': isLastColumn
        }, 'indigo-totals-select-type-list');

        const wrapperEvents = {
            onMouseEnter: () => {
                onWrapperHover(true, index);
            },
            onMouseLeave: () => {
                onWrapperHover(false, index);
            }
        };

        const addButtonProps = {
            hidden: !showAddTotalButton,
            onClick: () => {
                this.onOpenStateChanged(true, index);
            },
            onMouseEnter: () => {
                onButtonHover(true);
            },
            onMouseLeave: () => {
                onButtonHover(false);
            }
        };

        return (
            <div className="indigo-totals-add-wrapper" {...wrapperEvents} ref={this.setWrapperRef}>
                <Dropdown
                    onOpenStateChanged={opened => this.onOpenStateChanged(opened, index)}
                    alignPoints={[dropdownAlignPoint]}
                    button={
                        <TableTotalsAddButton {...addButtonProps} />
                    }
                    body={
                        <DropdownBody
                            List={List}
                            dataSource={dataSource}
                            width={TOTALS_TYPES_DROPDOWN_WIDTH}
                            className={dropdownBodyClassName}
                            rowItem={
                                <DropdownItem onSelect={item => onAddTotalsRow(item.type)} />
                            }
                        />
                    }
                />
            </div>
        );
    }
}
