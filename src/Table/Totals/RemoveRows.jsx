import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';

import Button from '@gooddata/goodstrap/lib/Button/Button';

import { TOTALS_ADD_ROW_HEIGHT, totalsPropType, totalsDefaultProp } from '../TableVisualization';

export default class RemoveRows extends Component {
    static propTypes = {
        onRemove: PropTypes.func,
        ...totalsPropType
    };

    static defaultProps = {
        onRemove: noop,
        ...totalsDefaultProp
    };

    constructor(props) {
        super(props);

        this.setWrapperRef = this.setWrapperRef.bind(this);
    }

    getWrapperRef() {
        return this.wrapperRef;
    }

    setWrapperRef(ref) {
        this.wrapperRef = ref;
    }

    render() {
        const { totals, onRemove } = this.props;

        const style = { bottom: `${TOTALS_ADD_ROW_HEIGHT}px` };

        return (
            <div className="indigo-totals-remove" style={style} ref={this.setWrapperRef}>
                {totals.map(total => (
                    <div className="indigo-totals-remove-row" key={`totals-row-overlay-${total.type}`}>
                        <Button
                            className={classNames(`s-totals-rows-remove-${total.type}`, 'indigo-totals-row-remove-button')}
                            onClick={() => { onRemove(total.type); }}
                        />
                    </div>
                ))}
            </div>
        );
    }
}
