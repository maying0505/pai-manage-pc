import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Row, Col, Form, Select, Button, Modal, message, DatePicker, Icon } from 'antd';
import * as HTTP from 'units/Axios';
import zh_CN from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';

const FormItem = Form.Item;
const Option = Select.Option;

class SeeingTimeForm extends React.Component {
    static propTypes = {
        seeingTimeVisible: PropTypes.bool,
        seeingTimeId: PropTypes.string,
        seeingTimeHandleCancel: PropTypes.func,
    };

    static defaultProps = {
        seeingTimeHandleCancel: ()=>{},
        seeingTimeVisible: false,
        seeingTimeId: '',
    };

    constructor(props) {
        super(props)
        this.state = {
            keyArray: [0],
            outsideOperatorList: [],
            uuid: 1,
            isSeeingTime: false
        }
    }
    componentWillMount(){
        this._outsideOperatorListFetch();
    }
    _outsideOperatorListFetch = async () => {
        try {
            const result = await HTTP.getOutsideOperator({
            });
            console.log('result', result);
            if (result.success) {
                this.setState({
                    outsideOperatorList: result.data
                })
            } else {
                message.error(result.message);
            }
        } catch (e) {
            // message.error(e.message);
        }
    };
    _seeingTimeSave = async (values) => { //看样时间提交
        console.log(this.props.seeingTimeId)
            try {
                const result = await HTTP.viewSampleGet({
                    ...values,
                    assetBaseId: this.props.seeingTimeId
                });
                
                console.log('result', result);
                if (result.success) {
                    this.props.seeingTimeHandleCancel(true)
                    message.success(result.message);
                } else {
                    message.error(result.message);
                }
            } catch (e) {
                // message.error(e.message);
            }
    };
    _seeingTimeHandleOk = (e) => { //看样时间提交
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log(values)
            if (values.keys && !values.type) {
                let json = [];
                for(let i of values.keys){
                    let json_1 = {};
                    json_1.seeingTime = values['seeingTime'][i] ? values['seeingTime'][i].format('YYYY-MM-DD HH:mm:ss') : '';
                    json_1.userId = values['userId'][i] ?values['userId'][i] : '';
                    json_1.endTime = values['endTime'][i] ? values['endTime'][i].format('YYYY-MM-DD HH:mm:ss') : '';
                    json.push(json_1)
                }
                values.json = JSON.stringify(json);
            }
            values.seeingTime = undefined;
            values.userId = undefined;
            values.endTime = undefined;
            values.keys = undefined;
            this._seeingTimeSave(values);
        })
    };

    _seeingTimeHandleCancel = (e) => {
        console.log(e);
        this.props.form.setFieldsValue({
            keys: [0],
        });
        this.props.seeingTimeHandleCancel()
    }
    _add = () => {
        const { form } = this.props;
        // // can use data-binding to get
        const keys = form.getFieldValue('keys');
        console.log('keys',this.state.uuid)
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
            keys: nextKeys,
        });
    }

    _remove = (k) => {
        
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        console.log('keys',keys,k,keys.filter(key => key !== k))
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }
    _addHtmlText = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { form } = this.props;
        const { warrantSituation } = this.state;
        let keys = []
        // if (!this.props.ifShow) {
        
        getFieldDecorator('keys', { initialValue: this.state.keyArray});
        
        keys = getFieldValue('keys');
        // } else {
        //     keys = this.state.keyArray

        // }
        console.log('keys',getFieldValue('keys'))
        const formItems = keys.map((k, index) => {
        return (
            <Row key={index}>
                <Col md={24} sm={24}>
                    <FormItem className="small-input" label="开始时间">
                        {this.props.form.getFieldDecorator(`seeingTime[${k}]`,{initialValue: undefined,rules: [{
                            required: true, message: '必填项',
                         }]})(
                            <DatePicker style={{width: '100%'}} showTime format="YYYY-MM-DD HH:mm:ss" locale={zh_CN} placeholder="年/月/日"/>
                        )}
                    </FormItem>
                </Col>
                <Col md={24} sm={24}>
                    <FormItem className="small-input" label="结束时间">
                        {this.props.form.getFieldDecorator(`endTime[${k}]`,{initialValue: undefined,rules: [{
                            required: true, message: '必填项',
                         }]})(
                            <DatePicker style={{width: '100%'}} showTime format="YYYY-MM-DD HH:mm:ss" locale={zh_CN} placeholder="年/月/日"/>
                        )}
                    </FormItem>
                </Col>
                <Col md={24} sm={24}>
                    <FormItem className="small-input" label="看样人员">
                        {this.props.form.getFieldDecorator(`userId[${k}]`,{initialValue: undefined,rules: [{
                            required: true, message: '必填项',
                         }]})(
                            <Select placeholder="请选择" allowClear={true}>
                                {
                                    this.state.outsideOperatorList.length ? this.state.outsideOperatorList.map((val,index)=>
                                    <Option value={val.value} key={index}>{val.label}</Option>
                                ): null
                            }
                        </Select>
                        )}
                    </FormItem>
                </Col>
                {/* <Col md={4} sm={4}>
                    {index > 0 ? <Icon type="close" className="seeingTime_add_icon" onClick={() => this._remove(k)}/> : <Icon type="plus-circle-o" className="seeingTime_add_icon" onClick={this._add}/>}
                </Col> */}
            </Row>
            );
        })
        return formItems;
    }
    changeIsSeeingTime = (e) => {
        console.log(e.target.value)
        this.setState({
            isSeeingTime: !e.target.value
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title="看样时间"
                visible={this.props.seeingTimeVisible}
                onCancel={this._seeingTimeHandleCancel}
                footer={null}
                destroyOnClose={true}
                width='600px'
                >
                <Form onSubmit={this._seeingTimeHandleOk} layout="inline" className="ant-search-form text_center">
                    <FormItem className="radio_left">
                        {getFieldDecorator('type', {
                            // valuePropName: 'checked',
                            initialValue: false,
                        })(
                            <Checkbox onChange={this.changeIsSeeingTime}>不安排看样</Checkbox>
                        )}
                    </FormItem>
                    {!this.state.isSeeingTime && this._addHtmlText()}
                    <Row>
                        <Col md={24} sm={24}>
                            <Button htmlType="submit" onClick={this._seeingTimeHandleOk}>提交</Button>
                            <Button type="primary" style={{marginLeft: 8}} onClick={this._seeingTimeHandleCancel}>关闭</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>              
        );
    }
}
const SeeingTime = Form.create()(SeeingTimeForm)
export default SeeingTime