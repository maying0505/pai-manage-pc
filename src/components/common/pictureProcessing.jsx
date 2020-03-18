import React from 'react';
import PropTypes from 'prop-types';
import {  Modal, Carousel, Icon } from 'antd';
import Enlarge from 'style/img/fangda.png';
import Narrow from 'style/img/suoxiao.png';
import Scale from 'style/img/xuanzhuan.png';

const ModalWidth = 0.8 * document.body.clientWidth;
const TransformType = ['rotate', 'scale'];

class SamplePrevArrow extends React.Component {
    render() {
        const {cn, style, onClick} = this.props;
        return (
            <div className='img-arrow img-arrow-prev' onClick={onClick}>
                <Icon type='left' style={{fontSize: 20, color: 'white'}}/>
            </div>
        );
    }
}

class SampleNextArrow extends React.Component {
    render() {
        const {cn, style, onClick} = this.props;
        return (
            <div className='img-arrow img-arrow-next' onClick={onClick}>
                <Icon type='right' style={{fontSize: 20, color: 'white'}}/>
            </div>
        );
    }
}
class PictureProcessing extends React.Component {
    static propTypes = {
        pictureProcessingVisible: PropTypes.bool,
        pictureProcessingHandleCancel: PropTypes.func,
        carouselList: PropTypes.array,
        carouseCurrentIndex: PropTypes.number,
    };

    static defaultProps = {
        carouseCurrentIndex: 0,
        carouselList: [],
        pictureProcessingHandleCancel: ()=>{},
        pictureProcessingVisible: false,
    };

    constructor(props) {
        super(props)
        this.state = {
            pictureProcessingVisible: false,
            carouselList: [],
            carouseCurrentIndex: 0,
            transformRotate: 0,
            transformScale: 1,
            transformType: null,
            dragEndOffset: {ex: null, ey: null},
        };
        this.chooseIndex = null;
        this.dragStartOffset = {sx: null, sy: null};
    }
    componentDidMount() { //预加载数据
        this.propsDo(this.props);
    }

    componentWillReceiveProps(nextProps) { //组件接收到新的props时调用
        this.propsDo(nextProps);
    }

    propsDo = (props) => {
        if (props.pictureProcessingVisible !== this.state.pictureProcessingVisible) {
            this.setState({
                pictureProcessingVisible: props.pictureProcessingVisible
            },function(){
                if (props.pictureProcessingVisible) {
                        this.setState({
                            carouselList: props.carouselList
                        },() => {
                            this.slider && this.slider.innerSlider.slickGoTo(props.carouseCurrentIndex);
                        })
                    if (props.carouseCurrentIndex !== this.state.carouseCurrentIndex) {
                        this.setState({
                            carouseCurrentIndex: props.carouseCurrentIndex
                        })
                    }
                }
            })
        }
        
        
    }

    _onNextPress = () => {
    };

    _onPrevPress = () => {

    };

    _onAfterChange = (current) => {
        this.setState(preState => ({
            carouseCurrentIndex: current,
            transformRotate: preState.carouseCurrentIndex !== current ? 0 : preState.transformRotate,
            transformScale: preState.carouseCurrentIndex !== current ? 1 : preState.transformScale,
            dragStartOffset: preState.carouseCurrentIndex !== current ? {sx: null, sy: null} : preState.dragStartOffset,
            dragEndOffset: preState.carouseCurrentIndex !== current ? {ex: null, ey: null} : preState.dragEndOffset,
        }));
        
    };
    handleCancel = () => {
        this._onAfterChange(this.state.carouseCurrentIndex);
        this.props.pictureProcessingHandleCancel();
    };
    _onTransformRotate = (type) => {
        let transformRotate = this.state.transformRotate;
        if (type === '1') {
            transformRotate += 90;
        } else if (type === '2') {
            transformRotate -= 90;
        }
        this.setState({
            transformRotate,
            transformType: TransformType[0],
        });
    };
    _onTransformScale = (type) => {
        let transformScale = this.state.transformScale;
        if (type === '1') {
            transformScale += 0.1;
        } else if (type === '2') {
            transformScale -= 0.1;
        }
        this.setState({
            transformScale,
            transformType: TransformType[1],
        });
    };
    _onDragStart = (domId, index, event) => {
        const img = document.getElementById(domId);
        const {clientX, clientY} = event.nativeEvent;
        const sx = clientX - [img.offsetLeft - index * (ModalWidth - 48)];
        this.dragStartOffset = {sx: sx, sy: clientY - img.offsetTop};
    };

    _onDrag = (domId, index, event) => {

    };

    _onDragEnd = (event) => {
        const {clientX, clientY} = event.nativeEvent;
        this.setState(() => ({
            dragEndOffset: {ex: clientX, ey: clientY},
        }));
    };

    render() {
        const { pictureProcessingVisible, carouselList, transformRotate, transformScale, dragEndOffset, carouseCurrentIndex } = this.state;
        const settings = {
            dots: false,
            arrows: true,
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: false,
            nextArrow: <SampleNextArrow onClick={this._onNextPress}/>,
            prevArrow: <SamplePrevArrow onClick={this._onPrevPress}/>,
        };
        return (
            <Modal
                    footer={null}
                    onCancel={this.handleCancel}
                    visible={pictureProcessingVisible}
                    bodyStyle={{overflow: 'hidden'}}
                    width={`${ModalWidth}px`}
                    destroyOnClose={true}
                >
                    <div className='button'>
                        <div className='b' onClick={() => this._onTransformRotate('1')}>
                            <img src={Scale}/>
                        </div>
                        {/*<div className='b' onClick={() => this._onTransformRotate('2')}>-90deg</div>*/}
                        <div className='b' onClick={() => this._onTransformScale('1')}>
                            <img src={Enlarge}/>
                        </div>
                        <div className='b' onClick={() => this._onTransformScale('2')}>
                            <img src={Narrow}/>
                        </div>
                    </div>
                    <Carousel
                        {...settings}
                        ref={el => {this.slider = el;}}
                        afterChange={this._onAfterChange}
                    >
                        {
                            carouselList.map((item, index) => {
                                const url = item['bigUrl'] || item.url || item.thumbUrl || item.waterMarkImage;
                                const sRotate = `rotate(${transformRotate}deg)`;
                                const sScale = `scale(${transformScale})`;
                                let sTop = 0;
                                let sLeft = 0;
                                const {sx, sy} = this.dragStartOffset;
                                const {ex, ey} = dragEndOffset;
                                if (sx !== null && sy !== null && ex !== null && ey !== null) {
                                    sLeft = ex - sx;
                                    sTop = ey - sy;
                                }

                                const sty = carouseCurrentIndex === index ? {
                                    transform: `${sRotate} ${sScale}`,
                                    top: `${sTop}px`,
                                    left: `${sLeft}px`
                                } : null;

                                return (
                                    <div key={index} className='img-container'>
                                        <img
                                            id={item.uid}
                                            alt="图片"
                                            src={url}
                                            draggable={true}
                                            onDrag={(e) => this._onDrag(item.uid, index, e)}
                                            onDragStart={(e) => this._onDragStart(item.uid, index, e)}
                                            onDragEnd={this._onDragEnd}
                                            style={sty}
                                        />
                                    </div>
                                )
                            })
                        }
                    </Carousel>
                    
                </Modal>              
        );
    }
}
export default PictureProcessing