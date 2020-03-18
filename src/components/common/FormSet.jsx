import React from 'react'
import PropTypes from 'prop-types'
import { Cascader, Icon, Row, Col, Form, Input, Select, DatePicker, message, InputNumber } from 'antd'
import zh_CN from 'antd/lib/date-picker/locale/zh_CN';
import NumericInputBox from './NumericInputBox';
import 'moment/locale/zh-cn';
import moment from 'moment';
import * as HTTP from 'units/Axios';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const dateFormat1 = 'YYYY-MM-DD';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
class FormSet extends React.Component {
    static propTypes = {
        size:  PropTypes.string,
        searchArr: PropTypes.array,
        ColMd: PropTypes.number,
        ColSm: PropTypes.number,
        form: PropTypes.object.isRequired,
        defaultValues: PropTypes.object,
        isShow: PropTypes.bool,
    };

    static defaultProps = {
        size: 'default',
        isShow: false,
        defaultValues: {},
        ColMd: 6,
        ColSm: 12,      
        searchArr: [
            {
                label: '法院',
                child: [
                    {
                        fieldName: 'courtJudge',
                        style: 'court'
                    }
                ],
            },
            {
                label: '资产类型',
                child: [
                    {
                        fieldName: 'type',
                        value:'',
                        style: 'assetType'
                    }
                ],
            },
            {
                label: '标的物',
                child: [
                    {
                        fieldName: 'bidName',
                        value:'',
                        style: 'input'
                    }
                ],
            },
            {
                label: '移交时间',
                child: [
                    {
                        fieldName: 'transferDate',
                        value:'',
                        style: 'dataRange'
                    }
                ],
            },
            {
                label: '状态',
                child: [
                    {
                        fieldName: 'status',
                        style: 'assetStatus'
                    }
                ],
            },
            {
                label: '拍卖时间',
                child: [
                    {
                        fieldName: 'auctionTime',
                        value:'',
                        style: 'dataRange'
                    }
                ],
            },
            {
                label: '归属地区',
                child: [
                    {
                        fieldName: 'adress',
                        value:'',
                        style: 'area'
                    }
                ],
            },
            {
                label: '看样时间',
                child: [
                    {
                        fieldName: 'seeingTime',
                        value:'',
                        style: 'dataRange'
                    }
                ],
            },
            {
                label: '拍卖阶段',
                child: [
                    {
                        fieldName: 'stage',
                        value: [
                            {
                                value: 0,
                                text: '第一次拍卖',
                            },
                            {
                                value: 1,
                                text: '第二次拍卖',
                            },
                            {
                                value: 2,
                                text: '变卖',
                            },
                        ],
                        style: 'select'
                    }
                ],
            }
        ],
    };

    constructor(props) {
        super(props)
        this.state = {
            courtList: [],
            courtList1: [],
            assetTypeList: [],
            assetStatusList: [],
            outsideOperatorList: [],
            areaList: [],
            keyArray: [0,1,2],
            uuid: 3,
            defaultValues: {},
            numberInput: '',
            warrantSituation: [],//权证情况
        }
    }
    
    componentWillMount(){ //预加载数据
        this.propsGet(this.props); 
        this._courtListFetch();
        this._courtListFetch1();
        this._areaListFetch();
        this._assetTypeListFetch();
        this._assetStatusListFetch();
        this._outsideOperatorListFetch();
    }
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        this.propsGet(nextProps);
    }

    propsGet = (props) => {
        if (props.defaultValues !== this.state.defaultValues){
            if (props.defaultValues.warrants && JSON.parse(props.defaultValues.warrants).length > 1) {
                let keyArrayB = [];
                JSON.parse(props.defaultValues.warrants).forEach(function(currentValue, index){
                    keyArrayB.push(index)
                })
                this.setState({
                    keyArray: keyArrayB,
                    uuid: (JSON.parse(props.defaultValues.warrants).length)+1
                })
            }
            
            this.setState({
                defaultValues: props.defaultValues,
                warrantSituation: props.defaultValues.warrants ? JSON.parse(props.defaultValues.warrants) : []
            },function(){
            })
        }
    }
    _outsideOperatorListFetch = async (params) => {
        if (sessionStorage.getItem('outsideOperatorList')) {
            this.setState({
                outsideOperatorList: JSON.parse(sessionStorage.getItem('outsideOperatorList'))
            })
            return
        } 
        try {
            const result = await HTTP.getOutsideOperator({
            });
            if (result.success) {
                this.setState({
                    outsideOperatorList: result.data
                })
                sessionStorage.setItem('outsideOperatorList',JSON.stringify(result.data))
            } else {
                message.error(result.message);
            }
        } catch (e) {
            // message.error(e.message);
        }
    };
    _assetStatusListFetch = async (params) => {
        if (sessionStorage.getItem('assetStatusList')) {
            this.setState({
                assetStatusList: JSON.parse(sessionStorage.getItem('assetStatusList'))
            })
            return
        } 
        try {
            const result = await HTTP.assetStatus({
                type: '0'
            });
            if (result.success) {
                this.setState({
                    assetStatusList: result.data
                })
                sessionStorage.setItem('assetStatusList',JSON.stringify(result.data))
            } else {
                message.error(result.message);
            }
        } catch (e) {
            // message.error(e.message);
        }
    };
    _assetTypeListFetch = async (params) => {
        if (sessionStorage.getItem('assetTypeList')) {
            this.setState({
                assetTypeList: JSON.parse(sessionStorage.getItem('assetTypeList'))
            })
            return
        } 
        try {
            const result = await HTTP.assetType({
            });
            if (result.success) {
                this.setState({
                    assetTypeList: result.data
                })
                sessionStorage.setItem('assetTypeList',JSON.stringify(result.data))
            } else {
                message.error(result.message);
            }
        } catch (e) {
            // message.error(e.message);
        }
    };
    _areaListFetch = async (params) => {
        if (sessionStorage.getItem('areaList')) {
            this.setState({
                areaList: JSON.parse(sessionStorage.getItem('areaList'))
            })
            return
        } 
        try {
            const result = await HTTP.areaGet({
            });
            if (result) {
                this.setState({
                    areaList: result
                })
                sessionStorage.setItem('areaList',JSON.stringify(result))
            } else {
                message.error(result.message);
            }
        } catch (e) {
            // message.error(e.message);
        }
    };
    _courtListFetch1 = async (params) => {
        if (sessionStorage.getItem('courtList1')) {
            this.setState({
                courtList1: JSON.parse(sessionStorage.getItem('courtList1'))
            })
            return
        } 
        try {
            const result = await HTTP.dictJudge1({
            });
            if (result.success) {
                this.setState({
                    courtList1: result.data
                })
                sessionStorage.setItem('courtList1',JSON.stringify(result.data))
            } else {
                message.error(result.message);
            }
        } catch (e) {
            // message.error(e.message);
        }
    };
    _courtListFetch = async (params) => {
        if (sessionStorage.getItem('courtList')) {
            this.setState({
                courtList: JSON.parse(sessionStorage.getItem('courtList'))
            })
            return
        } 
        try {
            const result = await HTTP.dictJudge({
            });
            if (result.success) {
                this.setState({
                    courtList: result.data
                })
                sessionStorage.setItem('courtList',JSON.stringify(result.data))
            } else {
                message.error(result.message);
            }
        } catch (e) {
            // message.error(e.message);
        }
    };
    
  
    inputBoxShow = (defaultValues,fieldName,key,style,value,length,placeholder,width,mode,format,disabled,disabledText) =>{
        let text = '';
        if (style === 'input') {
            text = <Input disabled={disabled ? disabled : false} key={key} placeholder={placeholder ? placeholder :""} style={{width: `${width ? width :90/length}%`}}/>
        } else if (style === 'data') {
            text =<DatePicker disabled={disabled ? disabled : false} showTime = {format? false : true} format={`${format ? format: "YYYY-MM-DD HH:mm:ss"}`} key={key} locale={zh_CN} placeholder={placeholder ? placeholder :"年/月/日"} style={{width: `${width ? width :90/length}%`}}/>
        } else if (style === 'numberInput') {
            text = <InputNumber precision="0" size={this.props.size} max={23} min={0} disabled={disabled ? disabled : false} key={key} placeholder={placeholder ? placeholder :""} style={{width: `${width ? width :90/length}%`}}/>
        } else if (style === 'dataRange') {
            text = <RangePicker disabled={disabled ? disabled : false} showTime = {format? false : true} format={`${format ? format: "YYYY-MM-DD HH:mm:ss"}`} key={key} locale={zh_CN} style={{width: `${width ? width :90/length}%`}}/>
        } else if (style === 'dataRangeTime') {
            text = <RangePicker showTime={{ format: 'HH' }} disabled={disabled ? disabled : false} format={`${format ? format: "YYYY-MM-DD HH:mm:ss"}`} key={key} locale={zh_CN} style={{width: `${width ? width :90/length}%`}}/>
        } else if (style === 'textarea') {
            text =<textarea disabled={disabled ? disabled : false}  placeholder={placeholder ? placeholder :""} style={{width: `${width ? width :90/length}%`}}></textarea>
        } else if (style === 'select') {
            text =<Select disabled={disabled ? disabled : false} allowClear mode={mode ? "multiple" : ''} key={key} placeholder={placeholder ? placeholder :"请选择"} style={{width: `${width ? width :90/length}%`}}>
                {
                    value.length ? value.map((val,index)=>
                    <Option value={val.value} key={index}>{val.text}</Option>
                ) : null
                }
            </Select>
        } else if (style === 'court1' || style === 'court' || style === 'area') { 
            if (style === 'court') {
                text = <Cascader changeOnSelect disabled={disabled ? disabled : false} style={{width: `${width ? width :90/length}%`}} placeholder={placeholder ? placeholder :"请选择"} options={this.state.courtList}/>
            } 
            if (style === 'court1') {
                text = <Cascader changeOnSelect disabled={disabled ? disabled : false} style={{width: `${width ? width :90/length}%`}} placeholder={placeholder ? placeholder :"请选择"} options={this.state.courtList1}/>
            }
            if (style === 'area') {
                text = <Cascader disabled={disabled ? disabled : false} style={{width: `${width ? width :90/length}%`}} placeholder={placeholder ? placeholder :"请选择"} options={this.state.areaList}/>
            }
            
        } else if (style === 'assetType' || style === 'assetStatus'|| style === 'outsideOperator') {
            let selectvalue = [];
            switch (style) {
                case 'assetType': selectvalue = this.state.assetTypeList;break;
                case 'assetStatus': selectvalue = this.state.assetStatusList;break;
                case 'outsideOperator': selectvalue = this.state.outsideOperatorList;break;
                default: selectvalue = [];
            }
            text =<Select disabled={disabled ? disabled : false} allowClear mode={mode ? "multiple" : ''} key={key} placeholder={placeholder ? placeholder :"请选择"} style={{width: `${width ? width :90/length}%`}}>
                {
                    selectvalue.length ? selectvalue.map((val,index)=>
                    <Option value={val.value ? val.value : val.status} key={index}>{val.label? val.label : val.name}</Option>
                ): null
                }
            </Select>
        }
        return text; 
    }

    _add = () => {
        const { form } = this.props;
        // // can use data-binding to get
        const keys = form.getFieldValue('emergencyKeys');
        if (keys.length === 5) {
            return;
        } 
        const nextKeys = keys.concat(this.state.uuid);
        this.setState({
            uuid: this.state.uuid+1
        });
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            emergencyKeys: nextKeys,
        });
    }

    _remove = (k) => {
        
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('emergencyKeys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            emergencyKeys: keys.filter(key => key !== k),
        });
    }

    _addHtmlText = (child,isRequired) => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { warrantSituation } = this.state;
        let emergencyKeys = []
        // if (!this.props.ifShow) {
            getFieldDecorator('emergencyKeys', { initialValue: this.state.keyArray});
            emergencyKeys = getFieldValue('emergencyKeys');
        // } else {
        //     emergencyKeys = this.state.keyArray

        // }
        // console.log(getFieldValue('emergencyKeys'))
        const initialValueDo = (index,item) => {
            let text = '';
            if (warrantSituation[index] && warrantSituation[index][item.fieldName]) {
                if (item.fieldName === 'cardDate') {
                    text = moment(`${warrantSituation[index][item.fieldName]}`, 'YYYY-MM-DD')
                } else {
                    text =  warrantSituation[index][item.fieldName]
                }
            } else if (item.disabledText) {
                text = item.disabledText[index];
            } else {
                text = undefined;
            }
            return text;
        }
        const formItems = emergencyKeys.map((k, index) => {
        return (
            <span key={index} style={{position: 'relative'}}>
                {child.map((item,key)=>
                    <span key={key}>
                        {item.beforeText && <span className="number-bettw">
                            {item.beforeText}
                        </span>}
                        {getFieldDecorator(`${item.fieldName}[${k}]`,{
                            initialValue: initialValueDo(index,item),
                            rules: [{ required: isRequired, message: '必填项!' }]
                        })(
                            this.inputBoxShow(null,item.fieldName,key,item.style,item.value,child.length,item.placeholder,item.width,item.mode,item.format,item.disabled && item.disabledText && item.disabledText[index]? true : false, item.disabledText && item.disabledText[index]? item.disabledText[index] : false)
                        )}
                        {item.unit && <span className="number-bettw">
                            {item.unit}
                        </span>}
                        
                </span>)}
                {index === 0 && <Icon type="plus-circle-o" className="add_icon" onClick={this._add}/>}
                {index > 2 && <Icon type="close" className="add_icon" onClick={() => this._remove(k)}/>}
            </span>
            );
        })
        return formItems;
    }
    initialValueDo = (style,data,fieldName) => {
        if (style === 'data' && data[fieldName]) {
            return moment(`${data[fieldName]}`, dateFormat)
        } else if (style === 'court') {
            if (data['sysUserId'] && data['officeId']) {
                return data['officeId'] && data['sysUserId'] && data['officeProvince'] && data['officeCity'] ? [data['officeProvince'],data['officeCity'],data['officeId'],data['sysUserId']] : []
            } else {
                return data['sysOffice'] && data['sysUser'] && data['officeProvince'] && data['officeCity'] ? [data['officeProvince'],data['officeCity'],data['sysOffice'],data['sysUser']] : []
            }
        } else if (fieldName === 'auctionTime' && style === 'dataRange') {
            return data['startAuctionTime'] && data['endAuctionTime'] ? [moment(data['startAuctionTime'], dateFormat),moment(data['endAuctionTime'], dateFormat)] : undefined
        } else if (fieldName === 'transferDate' && style === 'dataRange') {
            return data['startTransferDate'] && data['endTransferDate'] ? [moment(data['startTransferDate'], dateFormat),moment(data['endTransferDate'], dateFormat)] : undefined
        } else if (fieldName === 'seeingTime' && style === 'dataRange') {
            return data['startseeingTime'] && data['endseeingTime'] ? [moment(data['startseeingTime'], dateFormat),moment(data['endseeingTime'], dateFormat)] : undefined
        } else if (fieldName === 'suggestTime' && style === 'dataRange') {
            return data['startTime'] && data['endTime'] ? [moment(data['startTime'], dateFormat1),moment(data['endTime'], dateFormat1)] : undefined
        } else if (style === 'area') {
            return data['province'] && data['city'] && data['area'] ? [data['province'],data['city'],data['area']] : []
        } else if (fieldName === 'file') {
            return data['file'] ? JSON.parse(data['file']) : undefined
        } else if (data[fieldName] || data[fieldName] === 0) {
            return data[fieldName]
        }
        return undefined
    }
    
    numberInputShow = (fieldName,defaultValues) => {
        return <NumericInputBox form={this.props.form} fieldName={fieldName} defaultValue={defaultValues[fieldName]? defaultValues[fieldName]: ''}/>
    }
    
    searchContent = (index,label,child,isRequired,operation) => {
        const {getFieldDecorator} = this.props.form;
        const { defaultValues } = this.state;
        const text = <FormItem label={label} key={index}>
                        {
                            operation ? this._addHtmlText(child,isRequired):
                            child.map((item,key)=>
                                <span key={key}>
                                    {item.beforeText && <span className="number-bettw">
                                        {item.beforeText}
                                    </span>}
                                   {item.style === 'number' ? this.numberInputShow(item.fieldName,defaultValues):getFieldDecorator(item.fieldName,{
                                       initialValue: this.initialValueDo(item.style,defaultValues,item.fieldName),
                                       rules: [{ required: isRequired, message: '必填项!' }]
                                    })(
                                        this.inputBoxShow(defaultValues,item.fieldName,key,item.style,item.value,child.length,item.placeholder,item.width,item.mode,item.format,!item.disabled? false : true)
                                    )}
                                    {item.unit && <span className="number-bettw">
                                        {item.unit}
                                    </span>}
                                    
                                </span>
                            ) 
                        }   
                    </FormItem>;
        
        return text
    }
    showValueDo = (value,style,defaultValues,fieldName) => {
        let text = defaultValues[fieldName];
        if (style === 'select') {
            if (fieldName === 'file' && text && isArray(JSON.parse(text))) {
                let textJson = [];
                for (let item of value){
                    for (let val of JSON.parse(text)) {
                        if (item.value === val){
                            textJson.push(item.text);
                        }
                    }
                    
                }
                return textJson.join('、');
            }
            for (let item of value){
                if (item.value === defaultValues[fieldName]){
                    return text = item.text;
                }
            }
        }else if (style === 'court') {
            text = defaultValues['sysOffice'] && defaultValues['sysUser'] && defaultValues['officeProvince'] && defaultValues['officeCity'] ? `${defaultValues['officeProvince']} - ${defaultValues['officeCity']} - ${defaultValues['sysOffice']} - ${defaultValues['sysUser']}` : ''
            return text
        } else if (style === 'area') {
            text = defaultValues['province'] && defaultValues['city'] && defaultValues['area'] ? `${defaultValues['province']}-${defaultValues['city']}-${defaultValues['area']}` : ''
            return text
        } else if (style === 'assetType' || style === 'assetStatus'|| style === 'outsideOperator') {
            let selectvalue = [];
            switch (style) {
                case 'assetType': selectvalue = this.state.assetTypeList;break;
                case 'assetStatus': selectvalue = this.state.assetStatusList;break;
                case 'outsideOperator': selectvalue = this.state.outsideOperatorList;break;
                default: selectvalue = [];
            }
            for (let item of selectvalue){
                if (item.value === defaultValues[fieldName]){
                    return text = item.label;
                }
            }
            return text;
        } 
        return text; 
    }
    _addShowHtmlText = (child) => {
        const text = this.state.warrantSituation.map((item,index)=>
           <span key={index} className={ index> 0 ? 'margin_left_70' : ''}>
               {index+1}、
                {
                    child.map((val,key)=>
                    <span key={key}>
                        {val.showText}：{item[val.fieldName]} 
                        <span className="number-bettw_10"></span>
                    </span>
                )
                }
                <br></br>
            </span>
        )
        return text
    }
    showContent = (index,label,child,operation) => {
        const { defaultValues } = this.state;
        const text = <span key={index}>
                        <span>{label}{`${label? '：': ''}`}</span>
                        {
                            operation ? this._addShowHtmlText(child):
                            child.map((item,key)=>
                                <span key={key}>
                                    {item.beforeText && <span className="number-bettw">
                                        {item.beforeText}
                                    </span>}
                                    {this.showValueDo(item.value,item.style,defaultValues,item.fieldName)}
                                    {item.unit && <span className="number-bettw">
                                        {item.unit}
                                    </span>}
                                    
                                </span>
                            ) 
                        }   
                    </span>;
        
        return text
    }
    render() {
        const { ColMd, searchArr, ColSm } = this.props;
        return (
                <Row className="flex-wrap-wrap flex">
                    {searchArr.length ?
                        searchArr.map((item,index)=>
                        <Col md={24} xl={item.ColMd ? item.ColMd : ColMd} lg={item.ColSm ? item.ColSm : ColSm} key={index} className={`show_box ${item.class_name ? item.class_name : ''}`}>
                            {this.props.isShow ? 
                                this.showContent(index,item.label,item.child,item.operation) :
                                this.searchContent(index,item.label,item.child,item.isRequired,item.operation)}
                        </Col>
                    ) : null
                    }
                </Row>                
        );
    }
}
export default FormSet