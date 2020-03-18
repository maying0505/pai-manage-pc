import React from 'react';
import { Select, Form, Button, message, Spin, Anchor, InputNumber } from 'antd';
import FormSet from 'common/FormSet';
import DetailModuleBox from 'common/DetailModuleBox';
import SamplePersonnelTable from 'common/samplePersonnelTable';
import LodashDebounce from 'common/debounce';
import PicturesWall from 'components/ImgUpload';
import * as HTTP from 'units/Axios';
import 'components/AssetDetail/index.less';
import './index.less'
import {inject, observer} from 'mobx-react';
const Option = Select.Option;

@inject('pickerPosition','assetAdd')
@observer
class LookHousePropertyForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            numberConfig: {
                min: 0,
                max: 999999,
                step: 1,
                formatter: (val)=>{
                    if (isNaN(val)) {
                        return 0
                    } else {
                        let value = String(val);
                        if (value.indexOf('.') === -1){
                            return value ? Number(value) : undefined;
                        } else {
                            value = value.split('.')[0];
                            return Number(value);
                        }                       
                    }
                    
                }
            },
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
                    label: '看样时间',
                    child: [
                        {
                            fieldName: 'seeingTimeTwo',
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
            imgUploadArray: [
                {
                    label: '现场场景',
                    fieldName: 'localeImage',
                    businessType: 'X01'
                },
                {
                    label: '材料公告',
                    fieldName: 'postImage',
                    businessType: 'X02'
                },
            ],
            curTab: 'essential-information',
            HeaderTabs: [
                {
                    href: 'essential-information',
                    text: '基本信息'
                },
                {
                    href: 'look-images',
                    text: '看样图片'
                },
                {
                    href: 'look-signIn',
                    text: '看样签到'
                }
            ],
            detailData: {},
            imgDefaultData: [],
            isSave: true,
            imgSavaData: {},
            imgSavaDataSave: {},
            assetBaseId: '',
            isShow: true,
            isLook: false,
            sampleCustomerList: [],
            ifConfirmReservation: false,
            outsideOperatorList: sessionStorage.getItem('outsideOperatorList') ? JSON.parse(sessionStorage.getItem('outsideOperatorList')) : [],
            isM: this.props.match.params['isM'] === 'true' ? true : false,
            taskMans: [],
            taskMansText: '',
            isConfirmTaskMans: sessionStorage.getItem('isConfirmTaskMans') === '1' ? true : false,
            userId: this.props.match.params['userId'] ? this.props.match.params['userId'] : '',
            thePath: '',
            qrcode: '',
            ifSubmit: false
        }
    }

    componentDidMount() { //预加载数据
        this.jsonChoose(this.props.match.path);
        if (sessionStorage.getItem('pageName') === 'asset_look_detail') {//是否为标的勘验
            if (sessionStorage.getItem('status') === '0' || sessionStorage.getItem('status') === '1') {
                this.setState({
                    isLook: true
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
                thePath: 'house_property',
            })
        } else if (path.indexOf('other') !== -1) {
            this.setState({
                thePath: 'other',
            })
        } else if (path.indexOf('vehicle') !== -1) {
            this.setState({
                thePath: 'vehicle',
            })
        } else if (path.indexOf('land') !== -1) {
            this.setState({
                thePath: 'land',
            })
        }
    }

    _getDetailData = async (id) => { 
        try {
            const result = await HTTP.lookSampleDetail({
                assetBaseId: id,
                inquestId: this.state.userId
            });
            

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
                    taskMansText: result.data3 ? result.data3.join('、'): ''
                })
                this.getQrcode();
                this.imgDataDo(result.data2 ? result.data2 : {});
            } else {
                this.setState({
                    loading: false,
                })
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false
            })
        }
    }

    getQrcode = async () => { //获取二维码
        try {
            const result = await HTTP.getQrcode({
                assetId: this.state.assetBaseId, 
                timeId: this.state.userId
            });
            if (result.success) {
                this.setState({
                    qrcode: result.data.base64 ? result.data.base64: '',
                })
                this.getSampleCustomerList();
            } else {
                this.setState({
                    loading: false
                })
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false
            })
        }
    }

    getSampleCustomerList  = async () => { //看样客户列表
        try {
            const result = await HTTP.assetBookList({
                inquestId: this.state.userId
            });
            this.setState({
                loading: false
            })
            if (result.success) {
                this.setState({
                    sampleCustomerList: result.data ? result.data: [],
                })
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
    _onLookSave = LodashDebounce((e) => this.onLookSave(e));
    _onLookSubmit = LodashDebounce((e) => this.handleFormSubmit(e));
    _confirmTaskMan =  LodashDebounce((e) => this.confirmTaskMan(e));
    _onConfirmReservation =  LodashDebounce((e) => this.onConfirmReservation(e));

    onLookSave = (e) => {
        e.preventDefault();
        this.setState({
            ifSubmit: false,
            ifConfirmReservation: false
        },function(){
            this.handleSave(e);
        })
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        this.setState({
            ifSubmit: true,
            ifConfirmReservation: false
        },function(){
            this.handleSave(e);
        })
    }

    onConfirmReservation = (e) => {
        e.preventDefault();
        this.setState({
            ifSubmit: false,
            ifConfirmReservation: true
        },function(){
            this.handleSave(e);
        })
    }



    handleSave = (e) => {        
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
            values.numbers = values.numbers ? values.numbers : '';
            values.peoples = values.peoples ? JSON.stringify(values.peoples) : ''
            this.setState({
                loading: true,
            })
            if (this.state.ifConfirmReservation) {
                this.setState({
                    ifConfirmReservation: false
                })
                this._reNumberVerification(values)
            } else {
                this._save(values)
            }
            
        })
    }
    _reNumberVerification = async (data) => { 
        try {
            const result = await HTTP.reNumberVerification({
                code: data.numbers
            });
            console.log('result', result);
            if (result.success) {
                message.success(result.message);
                this.getSampleCustomerList();
            } else {
                this.setState({
                    loading: false
                })
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false,
            })
            // message.error(e.message);
        }
    }
    _save = async (data) => { 
        console.log(data)
        try {
            const result = await HTTP.saveRemake({
                remark: data.remark,
                inquestId: this.state.userId
            });
            console.log('result', result);
            this.setState({
                loading: false,
            })
            if (result.success) {
                if (this.state.ifSubmit) {
                    this.onLookSubmit();
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
    onLookSubmit = async (e) => { 
        try {
            const result = await HTTP.sampleSubmit({
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
    confirmTaskMan = async (e) => { 
        e.preventDefault();
        this.setState({
            loading: true,
        })
        try {
            const result = await HTTP.lookStatusGet({
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
        const { curTab, HeaderTabs, userId, taskMansText, taskMans, isConfirmTaskMans, isM, numberConfig, sampleCustomerList, outsideOperatorList, essentialInformation, isLook, isShow, imgDefaultData, detailData, imgUploadArray } = this.state;
        const { form } = this.props;
        const {getFieldDecorator} = form;
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
                <Form layout="inline" id="wy-scroll-layout" className={isShow && !isLook ? 'detail_box' : ''}> 
                    <DetailModuleBox title="基本信息" id="essential-information" className={isShow? 'detail_box' : ''}>
                        <FormSet isShow={isShow} defaultValues={detailData} searchArr={essentialInformation} ColMd={8} ColsM={12} form={form}/>
                        <div className="ant-row flex-wrap-wrap flex">
                        {
                            (isShow && !isLook) || !isM || isConfirmTaskMans ? <div className="show_box  ant-col-md-8"><span><span>陪同任务人：</span><span>{taskMansText}</span></span></div> : 
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
                        {/* <FormSet isShow={isShow && !isLook} defaultValues={detailData} searchArr={essentialInformation_1} ColMd={8} ColsM={12} form={form}/> */}
                    </DetailModuleBox>
                    <DetailModuleBox title="看样图片" id="look-images">
                        <div className={`${!isShow ? 'img_box_s' : ''}`}>
                            {isShow && <div className="bet_20" />}
                            {imgUploadArray.map((item,index)=>
                                <div className="width_half_img width_full" key={index}>
                                    <div className="flex img_box" key={index}>
                                        <span className="upload_label">{item.label}</span>
                                        <PicturesWall businessId={userId} businessType={item.businessType ? item.businessType : ''} disabled={!isLook && isShow} isD={!isLook && isShow} componentsStyle={item.fieldName} defaultFileList={imgDefaultData[index]? imgDefaultData[index] : []} onPicturesWallChange={this.onPicturesWallChange.bind(this)} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex remark_box">
                            <span className="vert_top">看样小结：</span>
                                {isLook ? getFieldDecorator('remark',{initialValue: detailData['remark'] ? detailData['remark'] : undefined})(
                                    <textarea className="flex-1" style={{minHeight: '100px',padding: '10px'}}></textarea>
                                ) : <span className="remark_text">{detailData['remark'] ? detailData['remark'] : '--'}</span>}
                        </div>
                    </DetailModuleBox>
                    <DetailModuleBox title="看样签到" id="look-signIn">
                        {isLook && <span className="blod">预约签到</span>}
                        {isLook && <div className="pad_15">
                            <div className="reservation_number">
                                <span>预约号</span>
                                {getFieldDecorator('numbers',{initialValue: undefined})(
                                    <InputNumber placeholder="请输入6位预约号" {...numberConfig}/>
                                )}
                                <Button type="primary" onClick={this._onConfirmReservation}>确认</Button>                      
                            </div>
                            <div className="qrcode_box">
                                <span>或者扫描</span>
                                <img src={`data:image/png;base64,${this.state.qrcode}`} style={{width: '150px'}}/>
                            </div>
                        </div>}
                        <span className="blod">预约客户</span>
                        <div className="pad_15">
                            <SamplePersonnelTable SampleCustomerList={sampleCustomerList}/>
                        </div>
                    </DetailModuleBox>
                    <div className="text_center form_submit_box">
                        {isLook && 
                            <Button type="primary" onClick={this._onLookSave}>保存</Button>
                        }
                        {
                            isLook && isM && <Button type="primary" style={{marginLeft: 8}} onClick={this._onLookSubmit}>提交</Button>
                        }
                        <Button style={{marginLeft: 8}} onClick={this.handleFormBack}>返回列表</Button>
                    </div>
                </Form>
            </Spin>
        )
    }
}

const LookHouseProperty = Form.create()(LookHousePropertyForm)
export default LookHouseProperty
