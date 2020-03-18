import React from 'react';

export default class PoiPickerInput extends React.Component {

    componentDidMount() {
        this._loadUI();
    }

    _loadUI = () => {
        window.AMapUI.loadUI(['misc/PoiPicker'], (PoiPicker) => {
            let poiPicker = new PoiPicker({
                input: 'pickerInput',
            });
            poiPicker.on('poiPicked', (poiResult) => {
                this.props.upDateAMapCenter(poiResult.item.location);
            });

        });
    };

    render() {
        return (
            <div className='picker-box' id='pickerBox'>
                <input className='picker-input' id='pickerInput' placeholder="输入关键字选取地点"/>
            </div>
        )
    }
}