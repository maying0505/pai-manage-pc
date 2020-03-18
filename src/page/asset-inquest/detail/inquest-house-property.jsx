import React from 'react';
import { Select, Modal, Form, Button, message, Spin, Anchor, Divider } from 'antd';
import FormSet from 'common/FormSet';
import DetailModuleBox from 'common/DetailModuleBox';
import LodashDebounce from 'common/debounce';
import PicturesWall from 'components/ImgUpload';
import Amap from 'components/amap';
import * as HTTP from 'units/Axios';
import 'components/AssetDetail/index.less';
import imageShowJson from 'components/AssetDetail/imageShowJson';
import showJson from 'components/AssetDetail/showJson';
import './index.less';
import {inject, observer} from 'mobx-react';
const Option = Select.Option;
const { Link } = Anchor;

@inject('pickerPosition')
@observer
class InquestHousePropertyForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            loading: true,
            essentialInformation: [
                {
                    label: '标的物名称',
                    isRequired: true,
                    child: [
                        {
                            fieldName: 'subjectMatterName',
                            value: '',
                            style: 'input'
                        }
                    ],
                },
                {
                    label: '标的物地址',
                    isRequired: true,
                    child: [
                        {
                            fieldName: 'address',
                            value: '',
                            style: 'input'
                        }
                    ],
                },
                {
                    label: '处置法院',
                    isRequired: true,
                    child: [
                        {   
                            fieldName: 'courtJudge',
                            value: '',
                            style: 'court'
                        }
                    ],
                },               
                {
                    label: '勘验时间',
                    child: [
                        {
                            fieldName: 'inquestDate',
                            value:'',
                            style: 'data'
                        }
                    ],
                },               
                {
                    label: '签到时间',
                    child: [
                        {
                            fieldName: 'signInTime',
                            value:'',
                            style: 'data'
                        }
                    ],
                },
                {
                    label: '签到坐标',
                    child: [
                        {
                            fieldName: 'signInAddress',
                            value:'',
                            style: 'input'
                        }
                    ],
                },
            ],
            standardDetail: [
                {
                    label: '标的物名称',
                    isRequired: true,
                    child: [
                        {
                            fieldName: 'subjectMatterName',
                            value: '',
                            style: 'input'
                        }
                    ],
                },
                {
                    label: '标的物编号',
                    isRequired: true,
                    child: [
                        {
                            fieldName: 'numbers',
                            value: '',
                            style: 'input'
                        }
                    ],
                },
                {
                    label: '钥匙',
                    child: [
                        {
                            fieldName: 'haveKey',
                            value: [
                                {
                                    value: '0',
                                    text: '无',
                                },
                                {
                                    value: '1',
                                    text: '有',
                                }
                            ],
                            style: 'select'
                        }
                    ],
                },
            ],
            standardDetail_others: showJson.standardDetail_others_house,
            standardDetailOtherFee: showJson.standardDetailOtherFee_house,
            standardDetailOtherFee_dataSources: showJson.standardDetailOtherFee_dataSources_house,
            standardDetailDistrictMatching_1: showJson.standardDetailDistrictMatching_1_house,
            standardDetailDistrictMatching_2: showJson.standardDetailDistrictMatching_2_house,
            standardDetailPeripheralEnvironment_1: showJson.standardDetailPeripheralEnvironment_1_house,
            standardDetailPeripheralEnvironment_2: showJson.standardDetailPeripheralEnvironment_2_house,           
            othersDetail: showJson.othersDetail,
            imgUploadArray: imageShowJson.imgUploadArray_house,
            curTab: 'essential-information',
            HeaderTabs: [
                {
                    href: 'essential-information',
                    text: '基本信息'
                },
                {
                    href: 'standard-detail',
                    text: '标的详情'
                },
                {
                    href: 'images',
                    text: '图片'
                }
            ],
            detailData: {},
            imgDefaultData: [],
            isSubmit: false,
            isSave: true,
            imgSavaData: {},
            imgSavaDataSave: {},
            assetBaseId: sessionStorage.getItem('assetBaseId') ? sessionStorage.getItem('assetBaseId') : '',
            longitude: '',//经度
            latitude: '',//纬度
            address: '',//地址
            isShow: true,
            isInquest: false,
            outsideOperatorList: sessionStorage.getItem('outsideOperatorList') ? JSON.parse(sessionStorage.getItem('outsideOperatorList')) : [],
            isM: this.props.match.params['isM'] === 'true' ? true : false,
            taskMans: [],
            taskMansText: '',
            isConfirmTaskMans: sessionStorage.getItem('isConfirmTaskMans') === '1' ? true : false,
            userId: this.props.match.params['userId'] ? this.props.match.params['userId'] : '',
            thePath: '',
            globalSave: HTTP.saveHouseInquest,
        }
    }

    componentDidMount() { //预加载数据
        console.log('props',this.props.match.params)
        this.jsonChoose(this.props.match.path);
        if (sessionStorage.getItem('pageName') === 'asset_inquest_detail') {//是否为标的勘验
            if (sessionStorage.getItem('status') === '1' || sessionStorage.getItem('status') === '2') {
                this.setState({
                    isInquest: true
                })
            }
        }
       
        if (sessionStorage.getItem('assetBaseId')) {
            this.setState({
                assetBaseId: sessionStorage.getItem('assetBaseId'),
            })
            this._getDetailData(sessionStorage.getItem('assetBaseId'))
        } else {
            this.setState({
                loading: false,
            })
        }
        window.scrollTo(0,0);
    }

    jsonChoose = (path) => {
        if (path.indexOf('house_property') !== -1) {
            this.setState({
                globalSave: HTTP.saveHouseInquest,
                thePath: 'house_property',
                imgUploadArray: imageShowJson.imgUploadArray_house,
                standardDetail_others: showJson.standardDetail_others_house,
            })
        } else if (path.indexOf('other') !== -1) {
            this.setState({
                globalSave: HTTP.saveHouseInquest,
                thePath: 'other',
                imgUploadArray: imageShowJson.imgUploadArray_house,
                standardDetail_others: showJson.standardDetail_others_house,
            })
        } else if (path.indexOf('vehicle') !== -1) {
            this.setState({
                globalSave: HTTP.saveCarInquest,
                thePath: 'vehicle',
                imgUploadArray: imageShowJson.imgUploadArray_vehicle,
                standardDetail_others: showJson.standardDetail_others_vehicle,
            })
        } else if (path.indexOf('land') !== -1) {
            this.setState({
                globalSave: HTTP.saveLandInquest,
                thePath: 'land',
                imgUploadArray: imageShowJson.imgUploadArray_land,
                standardDetail_others: showJson.standardDetail_others_land,
            })
        }
    }
    
    _getDetailData = async (id) => { 
        console.log(id)
        try {
            const result = await HTTP.getInquestBid({
                assetBaseId: id,
                inquestId: this.state.userId
            });
            console.log('houseStandardInforesult', result);
            this.setState({
                loading: false,
            })
            if (result.success) {
                let data = result.data;
                if (!this.state.isShow) {
                    data.officeProvince = data.officeProvince ? data.officeProvince['id'] : '';
                    data.officeCity = data.officeCity ? data.officeCity['id'] : '';
                    data.sysOffice = data.sysOffice ? data.sysOffice['id'] : '';
                    data.sysUser = data.sysUser ? data.sysUser['id'] : '';
                } else {
                    data.officeProvince = data.officeProvince ? data.officeProvince['name'] : '';
                    data.officeCity = data.officeCity ? data.officeCity['name'] : '';
                    data.sysOffice = data.sysOffice ? data.sysOffice['name'] : '';
                    data.sysUser = data.sysUser ? data.sysUser['name'] : '';
                }
                data.signInTime = result.data4.signInTime ? result.data4.signInTime: '';
                data.signInAddress = result.data4.signInAddress ? result.data4.signInAddress: '';
                if (this.state.thePath.indexOf('house_property') !== -1 || this.state.thePath.indexOf('other') !== -1) {
                    const assetHouse = data.assetHouse ? data.assetHouse : {};
                    data.assetHouse =  '';
                    data = {...data,...assetHouse};
                } else if (this.state.thePath.indexOf('vehicle') !== -1) {
                    const assetCar = data.assetCar ? data.assetCar : {};
                    data.assetCar =  '';
                    data = {...data,...assetCar};
                } else if (this.state.thePath.indexOf('land') !== -1) {
                    const assetLand = data.assetLand ? data.assetLand : {};
                    data.assetLand =  '';
                    data = {...data,...assetLand};
                }
                console.log('data:',data)
                
                this.setState({
                    detailData: data,
                    latitude: data.latitude? data.latitude: '',
                    longitude: data.longitude? data.longitude: '',
                    address: data.locationName? data.locationName: '',
                    taskMansText: result.data3 ? result.data3.join('、'): ''
                })
                this.imgDataDo(result.data2 ? result.data2 : {});
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false
            })
            // message.error(e.message);
        }
    }
    imgDataDo = (data) => {
        let imgSavaDataBoxs = {};
        let imgSavaDataBoxsSave = {};
        for (let value of this.state.imgUploadArray) {
            let imgDefaultDataBoxs = [];
            if (data[value.fieldName] && data[value.fieldName].length > 0) {
                for (let item of data[value.fieldName]) {
                    let imgDefaultDataBox = {};
                    imgDefaultDataBox['bigUrl'] = item['waterMarkImage'] ? item['waterMarkImage']: ''
                    imgDefaultDataBox['url'] = item['pathThumb2FileName'] ? item['pathThumb2FileName']: ''
                    imgDefaultDataBox['uid'] = `${value.fileName}${Math.random()}`
                    imgDefaultDataBox['status'] = 'done'
                    imgDefaultDataBox['fileName'] = item['fileName'] ? item['fileName']: ''
                    imgDefaultDataBoxs.push(imgDefaultDataBox)
                }
            } 
            imgSavaDataBoxs[value.fieldName] = imgDefaultDataBoxs
            imgSavaDataBoxsSave[value.fieldName] = data[value.fieldName] ? JSON.stringify(data[value.fieldName]) : '[]'
            this.setState({
                imgDefaultData: [...this.state.imgDefaultData,imgDefaultDataBoxs],
            },function(){
            })
        }
        this.setState({
            imgSavaDataSave: {...this.state.imgSavaDataSave,...imgSavaDataBoxsSave},
            imgSavaData: {...this.state.imgSavaData,...imgSavaDataBoxs}
        },function(){
        })
        
    }
    onPicturesWallChange = (event,index,style,status) =>{ //处理图片上传数据
        this.setState({
            isSave: false
        })
        if (status === 'uploading') return
        let imgSaveBox = []
        let isSaveBefore = true
        let imgSavaDataB = this.state.imgSavaData
        let imgSavaDataSaveB = this.state.imgSavaDataSave
        let imgSavaDataCur = this.state.imgSavaDataSave[style] ? this.state.imgSavaDataSave[style] : '[]'
        imgSavaDataCur = JSON.parse(imgSavaDataCur)
        
        for (let i in event) {
            // if (event[i].response) {
            //     event[i].response.success ? imgSaveBox.push(event[i].response.data): null
            //     if (i == (event.length-1)) {
            //         event[i].response.success ? null : message.error(event[i].response.message?event[i].response.message:'上传失败')
            //     }
            // } else {
            //     for (let item of imgSavaDataCur) {
            //         if (item['pathThumb2FileName'] === event[i].url){
            //             imgSaveBox.push(item)
            //         }
            //     }
            // }
            if (event[i].status !== 'done' && event[i].status) {
                isSaveBefore = false
            }
        }
        // imgSaveBox = JSON.stringify(imgSaveBox)
        console.log(event)
        console.log('imgSaveBox',imgSaveBox)
        imgSavaDataB[style] = imgSaveBox
        imgSavaDataSaveB[style] = JSON.stringify(imgSaveBox)
        this.setState({
            imgSavaData: imgSavaDataB,
            imgSavaDataSave: imgSavaDataSaveB,
            isSave: isSaveBefore
        },function(){
            console.log('imgSavaDataSave',this.state.imgSavaDataSave)
        })

    }
    /**
     * @desc 添加防抖，防止连击
     * */
    _onInquestSave = LodashDebounce((e) => this.handleSave(e));
    _onInquestSubmit = LodashDebounce((e) => this.handleFormSubmit(e));
    _confirmTaskMan =  LodashDebounce((e) => this.confirmTaskMan(e));

    handleFormSubmit = (e) => {
        e.preventDefault();
        this.setState({
            isSubmit: true
        },function(){
            this.handleSave(e);
        })
    }

    handleSave = (e) => {        
        e.preventDefault();
        if (!this.state.isSave){
            message.warning('请在所有文件上传完成后提交或保存!')
            return
        }
        this.props.form.validateFields((err, values) => {
            if (err) {
                message.warning('请填完必填项！');
                return;
            }
            console.log('values:', values)
            values.insuranceDate ? values.insuranceDate = values.insuranceDate.format('YYYY-MM-DD') : null;
            values.examineDate ? values.examineDate = values.examineDate.format('YYYY-MM-DD') : null;
            values.registerDate ? values.registerDate = values.registerDate.format('YYYY-MM-DD') : null;
            values.releaseDate ? values.releaseDate = values.releaseDate.format('YYYY-MM-DD') : null;
            values.evaluateDate ? values.evaluateDate = values.evaluateDate.format('YYYY-MM-DD') : null;
            values.transferDate ? values.transferDate = values.transferDate.format('YYYY-MM-DD HH:mm:ss') : null;
            values.inquestDate ? values.inquestDate = values.inquestDate.format('YYYY-MM-DD HH:mm:ss') : null;
            if (values.courtJudge) { //法院法官
                values.officeProvince = values.courtJudge[0];
                values.officeCity = values.courtJudge[1];
                values.sysOffice = values.courtJudge[2];
                values.sysUser = values.courtJudge[3];
            }
            values.courtJudge = undefined;

            if (values.addressBefore) { //归属地省市区
                values.province = values.addressBefore[0];
                values.city = values.addressBefore[1];
                values.area = values.addressBefore[2]
            }
            let warrantSituation = [];
            if (values.cardNumber) {
                for (let i = 0; i　< values.cardNumber.length; i++) {
                    if (!values.cardNumber[i] && !values.cardName[i] && !values.cardDate[i]) {
                            
                    } else {
                        let warrantJson = {};
                        warrantJson.cardNumber = values.cardNumber[i] ? values.cardNumber[i] : '';
                        warrantJson.cardName = values.cardName[i] ? values.cardName[i] : '';
                        warrantJson.cardDate = values.cardDate[i] ? values.cardDate[i].format('YYYY-MM-DD') : '';
                        warrantSituation.push(warrantJson)
                    }
                }
            }
            
            if (warrantSituation.length > 0) {
                values.warrants = JSON.stringify(warrantSituation)
            }
            values.file = JSON.stringify(values.file)
            values.cardDate = values.emergencyKeys = values.addressBefore = values.cardNumber = values.cardName = undefined;
            values.submit = this.state.ifSubmit;
            values.latitude = this.state.latitude;
            values.longitude = this.state.longitude;
            values.locationName = this.state.address;
            this.setState({
                loading: true,
            })
            this._save(values)
        })
    }
    
    _save = async (data) => { 
        console.log(data)
        try {
            const result = await this.state.globalSave({
                ...data,
                // ...this.state.imgSavaDataSave,
                assetBaseId: this.state.assetBaseId,
                inquestIdTwo: this.state.userId
            });
            console.log('result', result);
            this.setState({
                loading: false,
            })
            if (result.success) {
                if (this.state.isSubmit) {
                    this.setState({
                        isSubmit: false
                    },function(){
                        this.onInquestSubmit();
                    })
                } else {    
                    message.success('保存成功！');
                }
                
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false,
            })
            // message.error(e.message);
        }
    }
    onInquestSubmit = async (e) => { 
        this.setState({
            loading: true,
        })
        try {
            const result = await HTTP.submitInquest({
                assetBaseId: this.state.assetBaseId
            });
            console.log('result', result);
            this.setState({
                loading: false,
            })
            if (result.success) {
                message.success('提交成功！');
                this.props.history.go(-1);
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false,
            })
            // message.error(e.message);
        }
    }
    handleFormBack = () => {
        this.props.history.go(-1);
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    
    handleOk = (e) => {
        console.log(e);
        const {pickerPosition} = this.props.pickerPosition;
        const {lng,lat,address} = pickerPosition;
        console.log('pickerPosition',pickerPosition)
        this.setState({
            visible: false,
            longitude: lng,
            latitude: lat,
            address: address
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    confirmTaskMan = async (e) => { 
        e.preventDefault();
        this.setState({
            loading: true,
        })
        try {
            const result = await HTTP.inquestStatusGet({
                inquestDateId: this.state.userId,
                assetBaseId: this.state.assetBaseId,
                userJson: this.state.taskMans.length > 0 ? JSON.stringify(this.state.taskMans) : ''
            });
            console.log('result', result);
            this.setState({
                loading: false,
            })
            if (result.success) {
                sessionStorage.setItem('isConfirmTaskMans','1')
                this.setState({
                    isConfirmTaskMans: true
                })
                let taskMansJSON = [];
                let taskMansTextB = '';
                for (let item of this.state.outsideOperatorList) {
                    for (let val of this.state.taskMans) {
                        if (item.value === val) {
                            taskMansJSON.push(item.label)
                        }
                    }
                }
                taskMansTextB = taskMansJSON.join('、');
                this.setState({
                    taskMansText: taskMansTextB
                })
                message.success('确认成功！');
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false,
            })
            // message.error(e.message);
        }
    }
    
    changeTaskMans = (e) => {
        this.setState({
            taskMans: e
        })
    }

    scrollToAnchor = (anchorName) => {
        if (anchorName) {
            let anchorElement = document.getElementById(anchorName);
            console.log(anchorElement)
            if(anchorElement) { 
                this.setState({
                    curTab: anchorName
                })
                let scrollHeight = anchorElement.offsetTop - 65;
                console.log(scrollHeight)
                window.scrollTo(0,scrollHeight);
            }
        }
    }

    render() {
        const { thePath, curTab, HeaderTabs, userId, taskMansText, taskMans, isConfirmTaskMans, isM, outsideOperatorList, essentialInformation, standardDetailPeripheralEnvironment_1, standardDetailPeripheralEnvironment_2, standardDetailDistrictMatching_2, standardDetailDistrictMatching_1, isInquest, isShow, longitude, latitude, address, imgDefaultData, detailData, imgUploadArray, standardDetailOtherFee, standardDetailOtherFee_dataSources, standardDetail, standardDetail_others } = this.state;
        const { form } = this.props;

        return (
            <Spin size="large" spinning={this.state.loading}>
                <div className="tab_header">
                    <div className="ant-anchor-wrapper" style={{maxHeight: '100vh'}}>
                        <div className="ant-anchor">
                            {
                                HeaderTabs.map((item,index)=>
                                <div className={`${curTab === item.href ? 'ant-anchor-link-active' : ''} ant-anchor-link`} key={index}>
                                    <a className={`${curTab === item.href ? 'ant-anchor-link-title-active' : ''} ant-anchor-link-title`} onClick={()=>this.scrollToAnchor(item.href)} title={item.text}>{item.text}</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Form layout="inline" id="wy-scroll-layout" className={(isShow && !isInquest) || !isM ? 'detail_box' : ''}> 
                    <DetailModuleBox title="基本信息" id="essential-information" className={isShow? 'detail_box' : ''}>
                        <FormSet isShow={isShow} defaultValues={detailData} searchArr={essentialInformation} ColMd={8} ColsM={12} form={form}/>
                        <div className="ant-row flex-wrap-wrap flex">
                        {
                            (isShow && !isInquest) || !isM || isConfirmTaskMans ? <div className="show_box  ant-col-md-8"><span><span>陪同任务人：</span><span>{taskMansText}</span></span></div> : 
                            <div className="show_box  ant-col-md-8"><span><span>陪同任务人：</span>
                                <span style={{marginRight: '5%'}}>
                                    <Select
                                        mode="multiple"
                                        style={{ width: '55%' }}
                                        placeholder="请选择"
                                        onChange={this.changeTaskMans}
                                        value={taskMans}
                                        allowClear={true}
                                    >

                                        {outsideOperatorList.map((item,index)=>
                                            <Option key={index} value={item.value}>
                                                {item.label}
                                            </Option>
                                        )}
                                    </Select>
                                </span>
                                <Button type="primary" onClick={this._confirmTaskMan}>确认</Button>
                            </span></div>
                        }
                        </div>
                        {/* <FormSet isShow={isShow && !isInquest} defaultValues={detailData} searchArr={essentialInformation_1} ColMd={8} ColsM={12} form={form}/> */}
                    </DetailModuleBox>
                    <DetailModuleBox title="标的详情" id="standard-detail" className="pad0">
                        <div className={isShow? 'detail_box' : ''} style={{marginBottom: `${isInquest ? '25px': '0'}`}}>
                            <FormSet isShow={isShow} defaultValues={detailData} searchArr={standardDetail} ColMd={8} ColsM={12} form={form}/>
                        </div>
                        <div style={{padding: `${isInquest && isM ? '20px': '0'}`}}>
                            {!isShow && <Divider />}
                            <FormSet isShow={(isShow && !isInquest) || !isM } defaultValues={detailData} searchArr={standardDetail_others} ColMd={8} ColsM={12} form={form}/>
                            {(thePath === 'house_property' || thePath === 'other') && <div>
                                {!isShow && <Divider />}
                                <p className="blod font_size_16">欠费情况：</p>
                                <div className="flex" style={{position: 'relative',marginBottom: '15px'}}>
                                    <div>
                                        <FormSet isShow={(isShow && !isInquest) || !isM} defaultValues={detailData} searchArr={standardDetailOtherFee} ColMd={24} form={form}/>
                                    </div>
                                    {!isShow && <div style={{left: '50%',position: 'absolute',height: '100%'}}>
                                        <Divider type="vertical" style={{height: '100%'}}/>
                                    </div>}
                                    <div>
                                        <FormSet isShow={(isShow && !isInquest) || !isM} defaultValues={detailData} searchArr={standardDetailOtherFee_dataSources} ColMd={24} form={form}/>
                                    </div>
                                </div>
                                {!isShow && <Divider />}
                                <p className="blod font_size_16">小区配套：</p>
                                <div className="flex" style={{position: 'relative',marginBottom: '15px'}}>
                                    <div className="flex-1">
                                        <FormSet isShow={(isShow && !isInquest) || !isM} defaultValues={detailData} searchArr={standardDetailDistrictMatching_1} ColMd={24} form={form}/>
                                    </div>
                                    {!isShow && <div style={{left: '50%',position: 'absolute',height: '100%'}}>
                                        <Divider type="vertical" style={{height: '100%'}}/>
                                    </div>}
                                    <div className="flex-1">
                                        <FormSet isShow={(isShow && !isInquest) || !isM} defaultValues={detailData} searchArr={standardDetailDistrictMatching_2} ColMd={24} form={form}/>
                                    </div>
                                </div>
                                {!isShow && <Divider />}
                                <p className="blod font_size_16">周边环境：</p>
                                <div className="flex" style={{position: 'relative',marginBottom: '15px'}}>
                                    <div className="flex-1">
                                        <FormSet isShow={(isShow && !isInquest) || !isM} defaultValues={detailData} searchArr={standardDetailPeripheralEnvironment_1} ColMd={24} form={form}/>
                                    </div>
                                    {!isShow && <div style={{left: '50%',position: 'absolute',height: '100%'}}>
                                        <Divider type="vertical" style={{height: '100%'}}/>
                                    </div>}
                                    <div className="flex-1">
                                        <FormSet isShow={(isShow && !isInquest) || !isM} defaultValues={detailData} searchArr={standardDetailPeripheralEnvironment_2} ColMd={24} form={form}/>
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </DetailModuleBox>
                    <DetailModuleBox title="图片" id="images">
                        <div className={`img_box_c ${!isShow ? 'img_box_s' : ''}`}>
                            {isShow && <div className="bet_20" />}
                            {imgUploadArray.map((item,index)=>
                                <div className="width_half_img" key={index}>
                                    <div className="flex img_box" key={index}>
                                        <span className="upload_label">{item.label}</span>
                                        <PicturesWall businessId={userId} businessType={item.businessType ? item.businessType : ''} disabled={!isInquest && isShow} isD={!isInquest && isShow} componentsStyle={item.fieldName} defaultFileList={imgDefaultData[index]? imgDefaultData[index] : []} onPicturesWallChange={this.onPicturesWallChange.bind(this)} />
                                    </div>
                                </div>
                            )}
                            {isShow && <div className="bet_20" />}
                            <div className="width_half_img width_half_map">
                                <div className="flex img_box" style={{width: `${(isInquest || !isShow) ? '100%' : '45%'}`}}>
                                    <span className="upload_label flex-1">地理位置</span>
                                    {(isInquest || !isShow) && <Button className="flex-1" onClick={this.showModal}>选择位置</Button>}
                                    <span className="flex-1" style={{padding: '0 25px'}}>{address}</span>
                                    <span className="flex-1" style={{padding: '0 25px'}}>{longitude? '经度：':''}{longitude}</span>
                                    <span className="flex-1" style={{padding: '0 25px'}}>{latitude? '纬度：':''}{latitude}</span>
                                    <Modal
                                        title="地图"
                                        visible={this.state.visible}
                                        onOk={this.handleOk}
                                        onCancel={this.handleCancel}
                                        okText="确定"
                                        cancelText="取消"
                                        width="75vw"
                                        >
                                        <Amap/>
                                    </Modal>
                                </div>
                            </div>
                            <div className="img_box_line">
                                <Divider type="vertical" style={{height: '100%'}}/>
                            </div>
                        </div>
                    </DetailModuleBox>
                    <div className="text_center form_submit_box">
                        {isInquest && <Button type="primary" onClick={this._onInquestSave}>保存</Button>
                        }
                        {
                            isInquest && isM && <Button type="primary" style={{marginLeft: 8}} onClick={this._onInquestSubmit}>提交</Button>
                        }
                        <Button style={{marginLeft: 8}} onClick={this.handleFormBack}>返回列表</Button>
                    </div>
                </Form>
            </Spin>
        )
    }
}

const InquestHouseProperty = Form.create()(InquestHousePropertyForm)
export default InquestHouseProperty
