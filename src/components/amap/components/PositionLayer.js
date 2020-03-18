import React from 'react';

export default class PositionLayer extends React.Component {

    render() {
        const {pickerPosition} = this.props;
        if (pickerPosition) {
            const {address} = pickerPosition;
            const addressStr = `当前位置：${address}`;
            return (
                <div className='position-layer'>
                    {addressStr}
                </div>
            )
        } else {
            return null;
        }
    }
}