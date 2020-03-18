import React from 'react';
import PropTypes from 'prop-types';
import { Row, message, Spin, Modal, Col, Button, Input, Checkbox } from 'antd';
import LodashDebounce from 'common/debounce';
import PictureProcessing from 'common/pictureProcessing';
import * as HTTP from 'units/Axios';
import Amap from 'components/amap';
import imageShowJson from './imageShowJson';
import PicturesWall from 'components/ImgUpload';
import './index.less'
import {inject, observer} from 'mobx-react';
import eyeImg from 'style/img/eye.png';
import cloneDeep from 'lodash/cloneDeep';

@inject('pickerPosition')
@observer
class AssetAddRelease extends React.Component {
    static propTypes = {
        auctionUrl: PropTypes.string,
        userId: PropTypes.string,
        visible: PropTypes.bool,
        assetAddReleaseCancel: PropTypes.func,
        historyId: PropTypes.string,
    };

    static defaultProps = {
        auctionUrl: '',
        userId: '',
        historyId: '',
        visible: false,
        assetAddReleaseCancel: ()=>{},
    };
    constructor(props) {
        super(props)
        this.state = {
            assetAddReleaseImg: imageShowJson.assetAddReleaseImg,
            pictureProcessingVisible: false,
            carouseCurrentIndex: 0,
            isChecked: -1,
            isOnMouseOver: -1,
            loading: true,
            showArr: [
                {
                    label: '标题',
                    fieldName: 'name',
                    width: '89%',
                    style:'long',
                },
                {
                    label: '起拍价',
                    fieldName: 'startintPrice',
                },
                {
                    label: '保证金',
                    fieldName: 'bond',
                },
                {
                    label: '评估价',
                    fieldName: 'evaluationPrice',
                },
                {
                    label: '加价幅度',
                    fieldName: 'price',
                },
                {
                    label: '竞价周期',
                    fieldName: 'biddingCycle',
                },
                {
                    label: '标的物介绍',
                    fieldName: 'html',
                    style: 'scrollBox',
                    width: '90%'
                },
            ],
            detailData: {},
            detailData2: {},
            imgDefaultData: [],
            isSave: true,
            imgSavaData: {},
            assetBaseId: '',
            isShow: true,
            userId: '',
            auctionUrl: '',
            videoUrl: '',
            panoramicViewUrl: '',
            mapVisible: false,
            longitude: '',//经度
            latitude: '',//纬度
            address: '',//地址
            showBigArray: [],
            allChecked: [],
            coverVisible: false,
            imgVisible: false,
            allCheckedId: [],
            allCheckedShow: []
        }
    }

    componentDidMount() { //预加载数据
        this.propsDo(this.props);
    }
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        this.propsDo(nextProps);
    }

    propsDo = (props) => {
        console.log('props',props)
        if (!props.visible) {
            return
        }
        this.setState({
            userId: props.userId,
            auctionUrl: props.auctionUrl
        })
        this._getDetailData(props.userId,props.auctionUrl)
    }
    
    _getDetailData = async (id,auctionUrl) => { 
        try {
            const result = await HTTP.releaseGetData1({
                baseId: id,
                url: auctionUrl
            });
            this.setState({
                loading: false,
            })
            if (result.success) {
                let data = result.data;
                this.setState({
                    detailData: data,
                    detailData2: result.data2 ? result.data2 : {},
                },function(){
                    console.log('detailData2',this.state.detailData2)
                    this.setState({
                        videoUrl: this.state.detailData2.videoUrl,
                        panoramicViewUrl: this.state.detailData2.panoramicViewUrl,
                        longitude: this.state.detailData2.longitude,
                        latitude: this.state.detailData2.latitude,
                        address: this.state.detailData2.locationName,
                    })
                })
                this.imgDataDo(data.detailImageList ? data.detailImageList : []);
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false
            })
        }
    }

    imgDataDo = (data) => {
        let imgDefaultDataBoxs = [];
        for (let item of data) {
            let imgDefaultDataBox = {};
            imgDefaultDataBox['bigUrl'] = item['pathFileName'] ? item['pathFileName']: ''
            imgDefaultDataBox['url'] = item['pathThumb2FileName'] ? item['pathThumb2FileName']: ''
            imgDefaultDataBox['uid'] = item['id']
            imgDefaultDataBox['status'] = 'done'
            imgDefaultDataBox['fileName'] = item['fileName'] ? item['fileName']: ''
            imgDefaultDataBoxs.push(imgDefaultDataBox)
        }
        this.setState({
            imgDefaultData: [...this.state.imgDefaultData,...imgDefaultDataBoxs],
        })
        
    }

    // onPicturesWallChange = (event,index,style,status) =>{ //处理图片上传数据
    //     this.setState({
    //         isSave: false
    //     })
    //     console.log('status',status)
    //     if (status === 'uploading') return
    //     let imgSaveBox = []
    //     let isSaveBefore = true
    //     let imgSavaDataB = this.state.imgSavaData

    //     console.log(JSON.stringify(event))
    //     for (let i in event) {
    //         if (event[i].status !== 'done' && event[i].status) {
    //             isSaveBefore = false
    //         }
    //     }
    //     console.log(event)
    //     console.log(imgSaveBox)
    //     this.setState({
    //         imgSavaData: imgSaveBox,
    //         isSave: isSaveBefore
    //     },function(){
    //         console.log(this.state.imgSavaData)
    //     })

    // }
    /**
     * @desc 添加防抖，防止连击
     * */
    _onLookSave = LodashDebounce((e) => this.handleSave(e));

    handleSave = (e) => {        
        e.preventDefault();
        if (!this.state.isSave){
            message.warning('请在所有文件上传完成后提交或保存!')
            return
        }
        let coverId = this.state.allCheckedId[this.state.isChecked] ? this.state.allCheckedId[this.state.isChecked] : '';
        if (coverId === '') {
            message.warning('请完成封面设置!')
            return
        }
        this.setState({
            loading: true,
        })
        this._save(coverId)
    }
   
    _save = async (coverId) => {         
        try {
            const result = await HTTP.releaseSave({
                baseId: this.state.userId,
                url: this.state.auctionUrl,
                videoUrl: this.state.videoUrl,
                panoramicViewUrl: this.state.panoramicViewUrl,
                longitude: this.state.longitude,
                latitude: this.state.latitude,
                locationName: this.state.address,
                coverId: coverId,
                imageList: JSON.stringify(this.state.allCheckedId)
            });
            console.log('result', result);
            this.setState({
                loading: false,
            })
            if (result.success) {
                message.success('发布成功！');
                this.handleOk();
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false,
            })
        }
    }
   
    handleFormBack = () => {
        this.props.history.go(-1);
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({
            detailData: {},
            detailData2: {},
            loading: true
        },function(){
            this.props.assetAddReleaseCancel(true)
        })
        
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            detailData: {},
            detailData2: {},
            imgDefaultData: [],
            loading: true
        },function(){
            this.props.assetAddReleaseCancel()
        })
    }
    panoramicViewUrlDo = (e) => {
        this.setState({
            panoramicViewUrl: e.target.value
        })
    }

    videoUrlDo = (e) => {
        this.setState({
            videoUrl: e.target.value
        })
    }

    mapHandleOk = (e) => {
        console.log(e);
        const {pickerPosition} = this.props.pickerPosition;
        console.log('pickerPosition',pickerPosition)
        const {lng,lat,address} = pickerPosition;
        
        this.setState({
            mapVisible: false,
            longitude: lng,
            latitude: lat,
            address: address
        });
    }

    mapHandleCancel = (e) => {
        console.log(e);
        this.setState({
            mapVisible: false,
        });
    }

    showMapModal = () => {
        this.setState({
            mapVisible: true,
        });
    }

    onMouseOverDo = (key) => {
        this.setState({
            isOnMouseOver: key
        })
    }

    onMouseLeave = (key) => {
        this.setState({
            isOnMouseOver: -1
        })
    }
    chooseAll = (val,key) => {
        console.log('fffff',key,val.target.checked)
        let allCheckedB = this.state.allChecked;
        let allCheckedIdB = this.state.allCheckedId;
        if (val.target.checked) {
            allCheckedB.push(val.target.value);
            allCheckedIdB.push(val.target.value.uid);
            this.setState({
                allChecked: allCheckedB,
                allCheckedId: allCheckedIdB
            },function(){
                console.log('ffffallChecked',this.state.allChecked)
            })
        } else {
            allCheckedB.splice(allCheckedIdB.indexOf(val.target.value.uid),1);
            allCheckedIdB.splice(allCheckedIdB.indexOf(val.target.value.uid),1);
            this.setState({
                allChecked: allCheckedB,
                allCheckedId: allCheckedIdB
            },function(){
                console.log('ffffallChecked',this.state.allChecked)
            })
        }
    }

    choose = (key) => {
        this.setState({
            isChecked: key === this.state.isChecked ? -1 : key
        })
       
    }

    showBigImg = (key,showBigArray) => {
        this.setState({
            showBigArray: showBigArray,
            carouseCurrentIndex: key,
            pictureProcessingVisible: true
        })
    }

    pictureProcessingHandleCancel = () =>{
        this.setState({
            pictureProcessingVisible: false,
            carouseCurrentIndex: 0
        })
    }

    showImgDo = () => {
        this.setState({
            imgVisible: true
        })
    }

    imgHandleCancel = () => {
        this.setState({
            imgVisible: false
        })
    }

    coverChoose = () => {
        if (this.state.allChecked.length % 2 !== 0) {
            message.warning('请选择偶数张！')
            return;
        } 
        if (this.state.allChecked.length === 0) {
            message.warning('请选择图片！')
            return;
        }
        this.setState({
            coverVisible: true
        },function(){
            console.log('ffffallChecked',this.state.allChecked)
        })
    }

    coverHandleCancel = () => {
        this.setState({
            coverVisible: false
        })
    }

    coverHandleOk = () => {
        if (this.state.isChecked < 0) {
            message.warning('请完成封面设置！');
            return;
        }
        this.setState({
            coverVisible: false,
            imgVisible: false
        },function(){
            console.log('allCheckedShowB',this.state.allChecked)
            let allCheckedShowB = cloneDeep(this.state.allChecked);
            allCheckedShowB.splice(this.state.isChecked, 1);
            allCheckedShowB.unshift(this.state.allChecked[this.state.isChecked]);
            this.setState({
                allCheckedShow: allCheckedShowB
            },function(){
                console.log('allCheckedShowB',this.state.allChecked)
            })
        })
         
    }

    render() {
        const { visible } = this.props;
        const { allCheckedShow, allCheckedId, allChecked, coverVisible, showBigArray, imgVisible, assetAddReleaseImg, pictureProcessingVisible, carouseCurrentIndex, isChecked, isOnMouseOver, panoramicViewUrl, videoUrl, mapVisible, showArr, detailData, detailData2, imgDefaultData, loading, address, longitude, latitude } = this.state;
        console.log('assetAddReleaseImg',assetAddReleaseImg)
        return (
            <Modal
                title="标的发布"
                visible={visible}
                onOk={this._onLookSave}
                onCancel={this.handleCancel}
                destroyOnClose={true}
                okText="发布"
                cancelText="关闭"
                width="70%"
                >
                <Spin size="large" spinning={loading}>
                    <Row>
                        {showArr.map((item,index)=> 
                            <Col xl={item.style === 'long' || item.style === 'scrollBox' ? 24 : 8} lg={24} key={index} className="text_center flex" style={{marginBottom: '15px'}}>
                                <span className="release_label">{item.label}：</span>
                                <span className={`show_input text_left ${item.style === 'scrollBox' ? 'scroll_box' :''} ${item.fieldName === 'html' ? 'detail_show_html' :''}`} style={{width: `${item.width ? item.width : '60%'}`}}>
                                    <span dangerouslySetInnerHTML = {{ __html:detailData[item.fieldName] ? detailData[item.fieldName] : '--' }}></span>
                                </span>
                            </Col>
                        )}
                        {assetAddReleaseImg.map((item,index)=>
                            <Col md={24} sm={24} style={{marginBottom: '15px'}}>
                                <div className="width_half_img" key={index}>
                                    <div className="flex img_box" key={index}>
                                        <span className="upload_label">{item.label}</span>
                                        <PicturesWall businessType={item.businessType ? item.businessType : ''} disabled={true} isD={true} componentsStyle={item.fieldName} defaultFileList={detailData2[item.fieldName]? detailData2[item.fieldName] : []}  />
                                    </div>
                                </div>
                            </Col>
                        )}
                        <Col md={24} sm={24}className="text_center" style={{marginBottom: '15px'}}>
                            <div className="flex">
                                <span className="width_2" style={{width: '85px',marginRight: '30px',textAlign: 'left'}}>请选择前端显示图片并设置封面：</span>
                                <Button onClick={this.showImgDo}>选择图片</Button>
                            </div>
                        </Col>
                        <Col md={24} sm={24} className="text_center" style={{marginBottom: '15px',marginLeft:'115px'}}>
                            <PicturesWall disabled={true} isD={true}  defaultFileList={allCheckedShow} />
                        </Col>
                        <Col md={24} sm={24} className="text_center flex" style={{marginBottom: '15px'}}>
                            <span className="release_label">全景链接：</span>
                            <span className="show_input text_left" style={{width: "90%", border: 'none'}}>
                                <Input onChange={this.panoramicViewUrlDo} value={panoramicViewUrl}/>
                            </span>
                        </Col>
                        <Col md={24} sm={24} className="text_center flex" style={{marginBottom: '15px'}}>
                            <span className="release_label">视频链接：</span>
                            <span className="show_input text_left" style={{width: "90%", border: 'none'}}>
                                <Input onChange={this.videoUrlDo} value={videoUrl}/>
                            </span>
                        </Col>
                        <Col md={24} sm={24} className="text_center flex" style={{marginBottom: '15px',alignItems:'baseline'}}>
                            <span className="release_label">地理位置：</span>
                            <span className="show_input text_left" style={{width: "90%", border: 'none'}}>
                                <Button onClick={this.showMapModal}>选择位置</Button>
                                <span className="release_map_span">{address}</span>
                                <span className="release_map_span">{longitude? '经度：':''}{longitude}</span>
                                <span className="release_map_span">{latitude? '纬度：':''}{latitude}</span>
                            </span>
                            <Modal
                                title="地图"
                                visible={mapVisible}
                                onOk={this.mapHandleOk}
                                onCancel={this.mapHandleCancel}
                                okText="确定"
                                cancelText="取消"
                                width="75vw"
                                >
                                <Amap/>
                            </Modal>
                               
                        </Col>
                    </Row>
                </Spin>
                <Modal
                    title="请选择前端显示图片"
                    visible={imgVisible}
                    onCancel={this.imgHandleCancel}
                    destroyOnClose={true}
                    width="75vw"
                    footer={[
                        <Button type="primary" onClick={this.coverChoose}>下一步</Button>
                    ]}
                    >
                     <div className="flex flex-wrap-wrap">
                        {
                            imgDefaultData.map((val,key)=> {
                                return (
                                    <div key={`allImageList_key_${key}`} className="img_download_box" onMouseLeave={() => this.onMouseLeave(key)} onMouseOver={() => this.onMouseOverDo(key)}>
                                    {isOnMouseOver === key && <img src={eyeImg} className="img_download_eye" onClick={this.showBigImg.bind(this,key,imgDefaultData)}/>}
                                    <Checkbox checked={allCheckedId.indexOf(val.uid) !== -1} value={val} className="img_download_checkbox" onChange={(val) => this.chooseAll(val,key)}>
                                        {isOnMouseOver === key && <div className="img_download_mask"></div>}
                                        <img className="img_download_img" src={val.url}/>
                                    </Checkbox>
                                    </div>
                                )
                            }
                        )}
                    </div>
                </Modal>
                <Modal
                    title="请在前端显示图片中设置封面图片"
                    visible={coverVisible}
                    onCancel={this.coverHandleCancel}
                    destroyOnClose={true}
                    width="75vw"
                    footer={[
                        <Button key="back" onClick={this.coverHandleCancel}>上一步</Button>,
                        <Button type="primary" onClick={this.coverHandleOk}>确定</Button>
                    ]}
                    >
                    <div className="flex flex-wrap-wrap">
                        {
                            allChecked.map((val,key)=> {
                                return (
                                    <div key={`allImageList_key_${key}`} className="img_download_box" onMouseLeave={() => this.onMouseLeave(key)} onMouseOver={() => this.onMouseOverDo(key)}>
                                    {isOnMouseOver === key && <img src={eyeImg} className="img_download_eye" onClick={this.showBigImg.bind(this,key,allChecked)}/>}
                                    <Checkbox checked={isChecked === key} value={key} className="img_download_checkbox" onClick={() => this.choose(key)}>
                                        {isOnMouseOver === key && <div className="img_download_mask"></div>}
                                        <img className="img_download_img" src={val.url}/>
                                    </Checkbox>
                                    </div>
                                )
                            }
                        )}
                    </div>
                </Modal>
                <PictureProcessing carouseCurrentIndex={carouseCurrentIndex} pictureProcessingHandleCancel={this.pictureProcessingHandleCancel} pictureProcessingVisible={pictureProcessingVisible} carouselList={showBigArray}/>
            </Modal>
        )
    }
}

export default AssetAddRelease
