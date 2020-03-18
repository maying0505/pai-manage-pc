import React from 'react';
import {Map} from 'react-amap';
import {inject, observer} from 'mobx-react';

import './index.css';
import {LoadingMap, PositionLayer, PoiPickerInput} from './components';

const AMAP_KEY = 'ab9a8aba8b7afec23beef1ae81cde4e6';
const AMAP_VERSION = '1.4.8';

@inject('pickerPosition')
@observer
export default class MyMap extends React.Component {

    constructor() {
        super();
        this._mapEvents = {
            created: (map) => this._onAmapCreated(map),
            click: (events) => this._onAmapClick(events),
        };
    }

    componentDidMount() {
        console.log('this._window', window);
    }

    _onAmapClick = (events) => {
        const {upDateAMapCenter} = this.props.pickerPosition;
        upDateAMapCenter(events.lnglat);
    };

    _onAmapCreated = (instance) => {
        const {upDatePickerPosition} = this.props.pickerPosition;
        window.AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
            let positionPicker = new PositionPicker({
                mode: 'dragMap', //dragMarker,dragMap
                map: instance,
            });
            positionPicker.on('success', (positionResult) => {
                const {address, position} = positionResult;
                if (address && position.lat && position.lng) {
                    const {lat, lng} = position;
                    const obj = {
                        lat,
                        lng,
                        address,
                    };
                    upDatePickerPosition(obj);
                }
            });
            positionPicker.on('fail', (positionResult) => {
                upDatePickerPosition(null);
                console.log('positionResult', positionResult);
            });
            positionPicker.start();
        });
    };

    render() {
        const {pickerPosition, amapCenter, upDateAMapCenter} = this.props.pickerPosition;
        const plugins = [
            'Scale',
            {
                name: 'ToolBar',
                options: {
                    visible: true,  // 不设置该属性默认就是 true
                    liteStyle: false,
                    locate: true,
                    ruler: true,
                    position: 'LT',
                    onCreated(ins) {
                    },
                },
            }
        ];
        return (
            <div style={{width: '70vw', height: '70vh'}}>
                <Map
                    useAMapUI
                    center={amapCenter}
                    events={this._mapEvents}
                    plugins={plugins}
                    amapkey={AMAP_KEY}
                    loading={<LoadingMap/>}
                    version={AMAP_VERSION}
                >
                    <PositionLayer
                        pickerPosition={pickerPosition}
                    />
                    <PoiPickerInput upDateAMapCenter={upDateAMapCenter}/>
                </Map>
            </div>
        )
    }
}

