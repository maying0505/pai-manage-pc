import React from 'react';
import { Input, Modal, Form, Button, message, Spin, Divider } from 'antd';
import FormSet from 'common/FormSet';
import DetailModuleBox from 'common/DetailModuleBox';
import LodashDebounce from 'common/debounce';
import PicturesWall from 'components/ImgUpload';
import OperationProcessTable from 'common/operationProcessTable';
import ViewingSample from 'common/ViewingSample';
import OtherShow from 'common/otherShow';
import SuggestOpinion from 'common/suggestOpinion';
import AssetAddRelease from './asset-add-release';
import Amap from 'components/amap';
import * as HTTP from 'units/Axios';
import cloneDeep from 'lodash/cloneDeep';
import './index.less'
import {inject, observer} from 'mobx-react';
import imageShowJson from './imageShowJson';
import showJson from './showJson';

const FormItem = Form.Item;
const uuidv1 = require('uuid/v1');

@inject('pickerPosition')
@observer
class HousePropertyForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            suggestVvisible: false,
            auditOpinion: showJson.audit_opinion,
            assetAddReleaseVisible: false,
            visible: false,
            loading: true,
            ifSubmit: false,           
            curTab: 'auction-detail',
            fileUploadArray: imageShowJson.fileUpload,
            imgUploadArray: imageShowJson.imgUploadArray_house,
            auctionDetail: cloneDeep(showJson.auctionDetail),
            standardDetail: showJson.standardDetail_house,
            standardDetailTaxFee_buy: showJson.standardDetailTaxFee_buy,
            standardDetailTaxFee_sell: showJson.standardDetailTaxFee_sell,
            standardDetailTaxFee_common: showJson.standardDetailTaxFee_common,
            standardDetail_others: showJson.standardDetail_others_house,
            standardDetailOtherFee: showJson.standardDetailOtherFee_house,
            standardDetailOtherFee_dataSources: showJson.standardDetailOtherFee_dataSources_house,
            standardDetailDistrictMatching_1: showJson.standardDetailDistrictMatching_1_house,
            standardDetailDistrictMatching_2: showJson.standardDetailDistrictMatching_2_house,
            standardDetailPeripheralEnvironment_1: showJson.standardDetailPeripheralEnvironment_1_house,
            standardDetailPeripheralEnvironment_2: showJson.standardDetailPeripheralEnvironment_2_house,
            othersDetail: showJson.othersDetail,
            HeaderTabs: [
                {
                    href: 'auction-detail',
                    text: '拍卖详情'
                },
                {
                    href: 'standard-detail',
                    text: '标的详情'
                },
                {
                    href: 'others-detail',
                    text: '其他'
                },
                {
                    href: 'technological-process',
                    text: '流程'
                }
            ],
            detailData: {},
            imgDefaultData: [],
            isSave: true,
            imgSavaData: {},
            imgSavaDataSave: {},
            assetBaseId: sessionStorage.getItem('assetBaseId') ? sessionStorage.getItem('assetBaseId') : '',
            longitude: '',//经度
            latitude: '',//纬度
            address: '',//地址
            isShow: true,
            auctionLink: '',
            isRelease: false,
            isAudit: false,
            isAuditShow: false,
            isQuery: false,
            operationProcessId: '',
            thePath: '',
            saveInterface: HTTP.saveHouseBid,
            globalSave: HTTP.saveHouse,
            ifSuggest: this.props.match.params['ifSuggest'] ? this.props.match.params['ifSuggest'] : null,
            userId: this.props.match.params['userId'] ? this.props.match.params['userId'] : uuidv1(),
        }
    }

    componentDidMount() { //预加载数据
        
        console.log('this.props:',this.props.match.path)
        this.jsonChoose(this.props.match.path);
        if (sessionStorage.getItem('isRelease') === '1') { //是否为标的发布
            this.setState({
                isRelease: true,
                loading: false
            })
            return
        }
       
        if (sessionStorage.getItem('pageName') === 'asset_audit_detail') {//是否为标的审核
            if (sessionStorage.getItem('status') === '5') {
                this.setState({
                    isAudit: true
                })
            } else {
                this.setState({
                    isAuditShow: true
                })
            }
        }
        if (sessionStorage.getItem('pageName') === 'asset_add_detail' && (sessionStorage.getItem('status') === '0' || sessionStorage.getItem('status') === '4')) {
            this.setState({
                isShow: false
            })
        } 
        if (sessionStorage.getItem('pageName') === 'asset_query_detail' || sessionStorage.getItem('pageName') === 'bid_suggest_detail') {//是否为标的查询或者标的监拍
            this.setState({
                isQuery: true
            })
            let newHeaderTabs = this.state.HeaderTabs;
            newHeaderTabs.splice(3, 0, {
                href: 'viewing_sample',
                text: '看样'
            })
            this.setState({
                HeaderTabs: newHeaderTabs
            })
        }
        
        if (sessionStorage.getItem('assetBaseId') && this.props.location.pathname.indexOf('asset_detail/1') === -1) {
            this.setState({
                operationProcessId: sessionStorage.getItem('assetBaseId'),
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
        if (sessionStorage.getItem('status') === '4') {
            let auctionDetailBefore = this.state.auctionDetail;
            auctionDetailBefore[2] = {
                    label: '勘验时间',
                    isRequired: true,
                    child: [
                        {
                            fieldName: 'inquestDate',
                            value:'',
                            disabled: true,
                            style: 'data'
                        }
                    ],
                };
            auctionDetailBefore[3] = {
                    label: '勘验人员',
                    isRequired: true,
                    child: [
                        {
                            fieldName: 'inquestId',
                            disabled: true,
                            value: '',
                            style: 'outsideOperator'
                        }
                    ],
                }
            this.setState({
                auctionDetail: auctionDetailBefore
            },function(){
                console.log('auctionDetail',this.state.auctionDetail)
            })
        }
        if (path.indexOf('other') !== -1) {
            this.setState({
                globalSave: HTTP.saveHouse,
                saveInterface: HTTP.saveOtherBid,
                thePath: 'other',
                imgUploadArray: imageShowJson.imgUploadArray_house,
                standardDetail: showJson.standardDetail_house,
                standardDetail_others: showJson.standardDetail_others_house
            })
        } else if (path.indexOf('house_property') !== -1) {
            this.setState({
                globalSave: HTTP.saveHouse,
                saveInterface: HTTP.saveHouseBid,
                thePath: 'house_property',
                imgUploadArray: imageShowJson.imgUploadArray_house,
                standardDetail: showJson.standardDetail_house,
                standardDetail_others: showJson.standardDetail_others_house
            })
        } else if (path.indexOf('vehicle') !== -1) {
            this.setState({
                globalSave: HTTP.saveCar,
                saveInterface: HTTP.saveCarBid,
                thePath: 'vehicle',
                imgUploadArray: imageShowJson.imgUploadArray_vehicle,
                standardDetail: showJson.standardDetail_vehicle,
                standardDetail_others: showJson.standardDetail_others_vehicle,
            })
        } else if (path.indexOf('land') !== -1) {
            this.setState({
                saveInterface: HTTP.saveLandBid,
                globalSave: HTTP.saveLand,
                thePath: 'land',
                imgUploadArray: imageShowJson.imgUploadArray_land,
                standardDetail: showJson.standardDetail_land,
                standardDetail_others: showJson.standardDetail_others_land,
            })
        }
    }
    
    _releaseShow = () => { 
        if (this.state.auctionLink) {
            this.setState({
                assetAddReleaseVisible: true
            })
        } else {
            message.warning('请填写拍卖链接');
        }
        
    }

    _releaseGetData = async () => { 
        this.setState({
            loading: true,
        })
        try {
            const result = await HTTP.releaseGetData({
                assetBaseId: this.state.assetBaseId,
                type: '0',
                link: this.state.auctionLink
            });
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
                data.inquestId = data.inquestId ? data.inquestId : '';
                if (this.state.thePath.indexOf('house_property') || this.state.thePath.indexOf('other') !== -1) {
                    const assetHouse = data.assetHouse;
                    data.assetHouse =  '';
                    data = {...data,...assetHouse};
                } else if (this.state.thePath.indexOf('vehicle') !== -1) {
                    const assetCar = data.assetCar;
                    data.assetCar =  '';
                    data = {...data,...assetCar};
                } else if (this.state.thePath.indexOf('land') !== -1) {
                    const assetLand = data.assetLand;
                    data.assetLand =  '';
                    data = {...data,...assetLand};
                }
                
                console.log('data:',data)
                
                this.setState({
                    detailData: data,
                    latitude: data.latitude? data.latitude: '',
                    longitude: data.longitude? data.longitude: '',
                    address: data.locationName? data.locationName: '',
                })
                this.imgDataDo(result.data2 ? result.data2 : {});
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
                data.inquestId = data.inquestId ? data.inquestId : '';
                console.log('data:',data)
                
                this.setState({
                    detailData: data,
                    latitude: data.latitude? data.latitude: '',
                    longitude: data.longitude? data.longitude: '',
                    address: data.locationName? data.locationName: '',
                })
                this.imgDataDo(result.data2 ? result.data2 : {});
            } else {
                message.error(result.message);
            }
        } catch (e) {
            console.log('errrr:',JSON.stringify(e))
            this.setState({
                loading: false,
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
        let isSaveBefore = true
        for (let i in event) {
            if (event[i].status !== 'done' && event[i].status) {
                isSaveBefore = false
            }
        }
        this.setState({
            isSave: isSaveBefore
        })
    }
    /**
     * @desc 添加防抖，防止连击
     * */
    _onSaveDebounce = LodashDebounce((e) => this.handleFormSave(e));
    _onSubmitDebounce = LodashDebounce((e) => this.handleFormSubmit(e));
    _onAdopt = LodashDebounce((e) => this.onAdopt(e));
    _onReject = LodashDebounce((e) => this.onReject(e));
    
    onReject = async (e) => { 
        let audit_opinion_json = {};
        this.props.form.validateFields((err, values) => {
            console.log('values:', values)
            if (err) {
                message.warning('请填完必填项！');
                return;
            }
            audit_opinion_json['opinion'] = values.opinion ? values.opinion : ''
        })
        this.setState({
            loading: true,
        })
        try {
            const result = await HTTP.rollbackGet({
                assetBaseId: this.state.assetBaseId,
                ...audit_opinion_json
            });
            this.setState({
                loading: false,
            })
            console.log('result', result);
            if (result.success) {
                message.success('审核成功！');
                this.handleFormBack();
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

    onAdopt = async (e) => { 
        let audit_opinion_json = {};
        this.props.form.validateFields((err, values) => {
            console.log('values:', values)
            if (err) {
                message.warning('请填完必填项！');
                return;
            }
            audit_opinion_json['opinion'] = values.opinion ? values.opinion : ''
        })
        this.setState({
            loading: true,
        })
        try {
            const result = await HTTP.adoptGet({
                assetBaseId: this.state.assetBaseId,
                ...audit_opinion_json
            });
            this.setState({
                loading: false,
            })
            console.log('result', result);
            if (result.success) {
                message.success('审核成功！');
                this.handleFormBack();
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
    handleRelease = async (e) => { 
        this.setState({
            loading: true,
        })
        try {
            const result = await HTTP.getRelease({
                assetBaseId: this.state.assetBaseId,
                type: '0'
            });
            this.setState({
                loading: false,
            })
            console.log('result', result);
            if (result.success) {
                message.success('发布成功！');
                this.handleFormBack();
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

    handleFormSubmit = (e) => {
        this.setState({
            ifSubmit: true
        },function(){
            this.handleSave(e)
        })
    }

    handleFormSave = (e) => {
        this.setState({
            ifSubmit: false
        },function(){
            this.handleSave(e)
        })
    }

    handleSave = (e) => {        
        e.preventDefault();
        if (!this.state.isSave){
            message.warning('请在所有文件上传完成后提交或保存!')
            return
        }
        this.props.form.validateFields((err, values) => {
            console.log('values:', values)
            if (err) {
                message.warning('请填完必填项！');
                return;
            }
            
            values.insuranceDate = values.insuranceDate ? values.insuranceDate.format('YYYY-MM-DD') : undefined;
            values.examineDate = values.examineDate ? values.examineDate.format('YYYY-MM-DD') : undefined;
            values.registerDate = values.registerDate ? values.registerDate.format('YYYY-MM-DD') : undefined;
            values.releaseDate = values.releaseDate ? values.releaseDate.format('YYYY-MM-DD') : undefined;
            values.auctionTime = values.auctionTime ? values.auctionTime.format('YYYY-MM-DD HH:mm:ss') : undefined;
            values.transferDate = values.transferDate ? values.transferDate.format('YYYY-MM-DD HH:mm:ss') : undefined;
            values.inquestDate = values.inquestDate ? values.inquestDate.format('YYYY-MM-DD HH:mm:ss') : undefined;
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
            
            values.latitude = this.state.latitude;
            values.longitude = this.state.longitude;
            values.locationName = this.state.address;
            if (sessionStorage.getItem('status') === '4' || sessionStorage.getItem('status') === '6') {
                this._inspectSave(values)
            } else {
                values.submit = this.state.ifSubmit;
                this._save(values)
            }
            
            this.setState({
                loading: true,
            })
            
        })
    }
    _inspectSubmit = async () => { 
        try {
            const result = await HTTP.inspectSubmit({
                assetBaseId: this.state.assetBaseId
            });
            console.log('result', result);
            this.setState({
                loading: false,
            })
            if (result.success) {
                message.success('提交成功！');
                this.handleFormBack();
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false,
            })
        }
    }
    _inspectSave = async (data) => { 
        console.log(data)
        try {
            const result = await this.state.globalSave({
                ...data,
                assetBaseId: this.state.assetBaseId,
                inquestIdTwo: this.state.userId
            });
            console.log('result', result);
            this.setState({
                loading: false,
            })
            if (result.success) {
                if (this.state.ifSubmit) {
                    this.setState({
                        ifSubmit: false,
                    },function(){
                        if (sessionStorage.getItem('status') === '6') {
                            this.handleRelease()
                        } else {
                            this._inspectSubmit()
                        }
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
        }
    }
    _save = async (data) => { 
        console.log(data)
        try {
            const result = await this.state.saveInterface({
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
                message.success(this.state.ifSubmit? '提交成功！':'保存成功！');
                if (this.state.ifSubmit) {
                    this.handleFormBack();
                }
                this.setState({
                    ifSubmit: false,
                })
                
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
        if (this.props.location.pathname.indexOf('asset_detail/1') !== -1) {
            this.props.history.push('/project/asset_add')
        } else {
            this.props.history.go(-1);
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    
    handleOk = (e) => {
        console.log(e);
        const {pickerPosition} = this.props.pickerPosition;
        console.log('pickerPosition',pickerPosition)
        const {lng,lat,address} = pickerPosition;
        
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
    getLink = (event) => {
        this.setState({
            auctionLink: event.target.value
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
                if (this.state.isRelease) {
                    scrollHeight = anchorElement.offsetTop - 137;
                }
                
                console.log(scrollHeight)
                window.scrollTo(0,scrollHeight);
            }
        }
    }

    assetAddReleaseCancel = (e) =>{
        this.setState({
            assetAddReleaseVisible: false
        },function(){
            if (e) {
                this.handleFormBack();
            }
        })
    }

    _suggestModalShow = () => {
        this.setState({
            suggestVvisible: true
        })
    }

    suggestOpinionHandleCancel = (e) => {
        this.setState({
            suggestVvisible: false
        },function(){
            if (e) {
                this.handleFormBack();
            }
        })
    }

    suggestOpinionShowStart = (startOpinion) => {
        console.log('suggestOpinionShowStart',startOpinion)
        let json = JSON.parse(startOpinion);
        let showContent = null;
        json.map((item,index)=>{
            showContent = <div>{showContent}<p>{index+1}、{item}</p></div>
        })
       
        return showContent
    }

    suggestOpinionShowEnd = (endOpinion) => {
        let json = JSON.parse(endOpinion);
        let showContent = null;
        json.map((item,index)=>{
            showContent = <div>{showContent}<p>{index+1}、{item}</p></div>
        })
       
        return showContent
    }
    
    render() {
        const { suggestVvisible, ifSuggest, fileUploadArray, auditOpinion, thePath, assetAddReleaseVisible, curTab, HeaderTabs, userId, auctionLink, operationProcessId, isQuery, standardDetailPeripheralEnvironment_1, standardDetailPeripheralEnvironment_2, standardDetailDistrictMatching_2, standardDetailDistrictMatching_1, isAuditShow, isAudit, isRelease, isShow, longitude, latitude, address, assetBaseId, imgDefaultData, detailData, imgUploadArray, othersDetail, standardDetailOtherFee, standardDetailOtherFee_dataSources, auctionDetail, standardDetail, standardDetailTaxFee_buy, standardDetailTaxFee_sell, standardDetailTaxFee_common, standardDetail_others } = this.state;
        const { form } = this.props;
        const { getFieldDecorator } = form;
        console.log('ewewew:',detailData)
        return (
            <Spin size="large" spinning={this.state.loading} style={{minHeight: '200px'}}>
                {isRelease && <div className="margin_t_20 flex flex-align-center">
                    <span>拍卖链接：</span>
                    <span style={{width: '50%',display: 'inline-block',marginRight: '20px'}}><Input onChange={this.getLink} value={auctionLink}/></span>
                    <Button type="primary" onClick={this._releaseShow}>获取数据</Button>
                </div>}
                {!isRelease && 
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
                }
                {!isRelease &&
                    <Form layout="inline" id="wy-scroll-layout" className={this.state.isShow ? 'detail_box' : ''}> 
                        <DetailModuleBox title="拍卖详情" id="auction-detail">
                            <FormSet isShow={isShow} defaultValues={detailData} searchArr={auctionDetail} ColMd={8} ColsM={12} form={form}/>
                        </DetailModuleBox>
                        <DetailModuleBox title="标的详情" id="standard-detail">
                            <FormSet isShow={isShow} defaultValues={detailData} searchArr={standardDetail} ColMd={8} ColsM={12} form={form}/>
                            {!isShow && <Divider />}
                            <p className="blod font_size_16">税费情况：</p>
                            <div className="flex" style={{position: 'relative',marginBottom: '15px'}}>
                                <div className="flex-1">
                                    <span className="blod">买方税费</span>
                                    <FormSet isShow={isShow} defaultValues={detailData} searchArr={standardDetailTaxFee_buy} ColMd={24} form={form}/>
                                </div>
                                {!isShow && <div style={{left: '48%',position: 'absolute',height: '100%'}}>
                                    <Divider type="vertical" style={{height: '100%'}}/>
                                </div>}
                                <div className="flex-1">
                                    <span className="blod">卖方税费</span>
                                    <FormSet isShow={isShow} defaultValues={detailData} searchArr={standardDetailTaxFee_sell} ColMd={24} form={form}/>
                                </div>
                            </div>
                            <FormSet isShow={isShow} defaultValues={detailData} searchArr={standardDetailTaxFee_common} ColMd={16} form={form}/>
                            {!isShow && <Divider />}
                            <FormSet isShow={isShow} defaultValues={detailData} searchArr={standardDetail_others} ColMd={8} ColsM={12} form={form}/>
                            {(thePath === 'house_property' || thePath === 'other') && 
                                <div>
                                    {!isShow && <Divider />}
                                    <p className="blod font_size_16">其他费用情况：</p>
                                    <div className="flex" style={{position: 'relative',marginBottom: '15px'}}>
                                        <div style={{width: '50%'}}>
                                            <FormSet isShow={isShow} defaultValues={detailData} searchArr={standardDetailOtherFee} ColMd={24} form={form}/>
                                        </div>
                                        {!isShow && <div style={{left: '50%',position: 'absolute',height: '100%'}}>
                                            <Divider type="vertical" style={{height: '100%'}}/>
                                        </div>}
                                        <div style={{width: '50%'}}>
                                            <FormSet isShow={isShow} defaultValues={detailData} searchArr={standardDetailOtherFee_dataSources} ColMd={24} form={form}/>
                                        </div>
                                    </div>
                                    {!isShow && <Divider />}
                                    <p className="blod font_size_16">小区配套：</p>
                                    <div className="flex" style={{position: 'relative',marginBottom: '15px'}}>
                                        <div className="flex-1">
                                            <FormSet isShow={isShow} defaultValues={detailData} searchArr={standardDetailDistrictMatching_1} ColMd={24} form={form}/>
                                        </div>
                                        {!isShow && <div style={{left: '50%',position: 'absolute',height: '100%'}}>
                                            <Divider type="vertical" style={{height: '100%'}}/>
                                        </div>}
                                        <div className="flex-1">
                                            <FormSet isShow={isShow} defaultValues={detailData} searchArr={standardDetailDistrictMatching_2} ColMd={24} form={form}/>
                                        </div>
                                    </div>
                                    {!isShow && <Divider />}
                                    <p className="blod font_size_16">周边环境：</p>
                                    <div className="flex" style={{position: 'relative',marginBottom: '15px'}}>
                                        <div className="flex-1">
                                            <FormSet isShow={isShow} defaultValues={detailData} searchArr={standardDetailPeripheralEnvironment_1} ColMd={24} form={form}/>
                                        </div>
                                        {!isShow && <div style={{left: '50%',position: 'absolute',height: '100%'}}>
                                            <Divider type="vertical" style={{height: '100%'}}/>
                                        </div>}
                                        <div className="flex-1">
                                            <FormSet isShow={isShow} defaultValues={detailData} searchArr={standardDetailPeripheralEnvironment_2} ColMd={24} form={form}/>
                                        </div>
                                    </div>
                                </div>
                            }
                            {!isShow && <Divider />}
                            <p className="blod font_size_16">视频.图片：</p>
                            <div className={`img_box_c ${!isShow ? 'img_box_s' : ''}`}>
                                {isShow && <div className="bet_20" />}
                                {imgUploadArray.map((item,index)=>
                                    <div className="width_half_img" key={index}>
                                        <div className="flex img_box" key={index}>
                                            <span className="upload_label">{item.label}</span>
                                            <PicturesWall businessId={userId ? userId : assetBaseId} businessType={item.businessType ? item.businessType : ''} disabled={isShow} isD={isShow} componentsStyle={item.fieldName} defaultFileList={imgDefaultData[index]? imgDefaultData[index] : []} onPicturesWallChange={this.onPicturesWallChange.bind(this)} />
                                        </div>
                                    </div>
                                )}
                                <div className="width_half_img">
                                    <div className="flex img_box">
                                        <span className="upload_label">全景图</span>
                                        {!isShow ? <FormItem className="small-input">
                                                {getFieldDecorator('panoramicViewUrl',{initialValue: detailData['panoramicViewUrl']? detailData['panoramicViewUrl'] : undefined})(
                                                    <Input />
                                                )}
                                            </FormItem> : 
                                            <span style={{wordBreak:'break-all'}}>{detailData['panoramicViewUrl']? detailData['panoramicViewUrl'] : '--'}</span>
                                        }
                                    </div>
                                </div>
                                <div className="width_half_img">
                                    <div className="flex img_box">
                                        <span className="upload_label">视频上传</span>
                                        {!isShow ? <FormItem className="small-input">
                                                {getFieldDecorator('videoUrl',{initialValue: detailData['videoUrl']? detailData['videoUrl'] : undefined})(
                                                    <Input />
                                                )}
                                            </FormItem> : 
                                            <span style={{wordBreak:'break-all'}}>{detailData['videoUrl']? detailData['videoUrl'] : '--'}</span>
                                        }
                                    </div>
                                </div>
                                {isShow && <div className="bet_20" />}
                                <div className="width_half_img width_half_map">
                                    <div className="flex img_box" style={{width: `${isShow ? '45%' : '100%'}`}}>
                                        <span className="upload_label flex-1">地理位置</span>
                                        {!isShow && <Button className="flex-1" onClick={this.showModal}>选择位置</Button>}
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
                        <DetailModuleBox title="其他" id="others-detail">
                            {fileUploadArray.map((item,index)=>
                                <div className="flex img_box" key={index}>
                                    <span className="upload_label flex-3 upload_file_label">{item.label}</span>
                                    <span className="flex-23">
                                        <PicturesWall businessId={userId ? userId : assetBaseId} businessType={item.businessType ? item.businessType : ''} disabled={isShow} isD={isShow} componentsStyle={item.fieldName} defaultFileList={detailData[item.fieldName]? detailData[item.fieldName] : []} onPicturesWallChange={this.onPicturesWallChange.bind(this)} fileStyle={item.fileStyle ? item.fileStyle: ''} fileType={item.fileType ? item.fileType: ''}/>
                                    </span>
                                </div>
                            )}
                            { isShow ? <OtherShow showContent={othersDetail} showValues={detailData}/> :
                                <FormSet defaultValues={detailData} searchArr={othersDetail} ColMd={24} form={form}/>
                            }
                        </DetailModuleBox>
                        {isQuery && <DetailModuleBox title="看样" id="viewing_sample">
                            <ViewingSample assetBaseId={assetBaseId}/>
                        </DetailModuleBox>}
                        <DetailModuleBox title="流程" id="technological-process" className={isShow ? 'show_process border_b border_r': ''}>
                            <OperationProcessTable assetBaseId={operationProcessId}/>
                        </DetailModuleBox>
                        {isAudit && <DetailModuleBox title="审核意见" id="audit_opinion">
                            <FormSet isShow={!isAudit} defaultValues={detailData} searchArr={auditOpinion} ColMd={24} form={form}/>
                        </DetailModuleBox>}
                        {ifSuggest === '1' &&
                            <DetailModuleBox title="意见建议" className={isShow ? 'show_process border_b border_r': ''}>
                                <p className="font_blod">开始监拍</p>
                                {detailData['startOpinion'] ? <div className="suggest_opinion_box">{this.suggestOpinionShowStart(detailData['startOpinion'])}</div>: '--'}
                                <p className="font_blod">结束监拍</p>
                                {detailData['endOpinion'] ? <div className="suggest_opinion_box">{this.suggestOpinionShowEnd(detailData['endOpinion'])}</div>: '--'}
                            </DetailModuleBox>
                        }
                        <div className="text_center form_submit_box">
                            {!isShow && <span>
                                <Button htmlType="submit" type="primary" onClick={this._onSaveDebounce}>保存</Button>
                                <Button type="primary" style={{marginLeft: 8}} onClick={this._onSubmitDebounce}>提交</Button>
                            </span>}
                            {isAudit && <span>
                                <Button type="primary" onClick={this._onAdopt}>通过</Button>
                                <Button type="primary" style={{marginLeft: 8}} onClick={this._onReject}>驳回</Button>
                            </span>}
                            {ifSuggest === '0' &&
                                <Button type="primary" onClick={this._suggestModalShow}>提交意见</Button>
                            }
                            
                            <Button style={{marginLeft: 8}} onClick={this.handleFormBack}>返回列表</Button>
                        </div>
                    </Form>
                }
                <SuggestOpinion suggestOpinionVisible={suggestVvisible} superId={sessionStorage.getItem('suggestOpinionId')} suggestOpinionId={assetBaseId} suggestOpinionHandleCancel={this.suggestOpinionHandleCancel} />
                <AssetAddRelease auctionUrl={auctionLink} userId={assetBaseId ? assetBaseId : ''} visible={assetAddReleaseVisible} assetAddReleaseCancel={this.assetAddReleaseCancel}/>
            </Spin>
        )
    }
}

const HouseProperty = Form.create()(HousePropertyForm)
export default HouseProperty
