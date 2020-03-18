import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, message, Spin, Modal, Row, Col, DatePicker, Input } from 'antd';
import DetailModuleBox from 'common/DetailModuleBox';
import LodashDebounce from 'common/debounce';
import * as HTTP from 'units/Axios';
import 'components/AssetDetail/index.less';
import zh_CN from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
import './index.less'

class KeyRecordForm extends React.Component {
    static propTypes = {
        visible: PropTypes.bool,
        keyRecordsCancel: PropTypes.func,
        numbers: PropTypes.string,
        operator: PropTypes.string,
        revertoperator: PropTypes.string,
        assetBaseId: PropTypes.string,
        keyId: PropTypes.string,
        status: PropTypes.number,
    };

    static defaultProps = {
        status: -1,
        keyId: '',
        assetBaseId: '',
        revertoperator: '',
        operator: '',
        numbers: '',
        visible: false,
        keyRecordsCancel: ()=>{},
    };
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            showArr_1: [
                {
                    label: '操作人',
                    fieldName: 'seeingTimeTw33o',
                    value:'',
                },
            ],
            showArr_2: [
                {
                    label: '操作人',
                    fieldName: 'seeingTimeTw332o',
                    value:'',
                },
            ],
            showArr: [
                {
                    label: '法院',
                    fieldName: 'sysOffice',
                    value:'',
                },
                {
                    label: '资产类型',
                    fieldName: 'type',
                    value:'',
                },
                {
                    label: '标的物名称',
                    fieldName: 'subjectMatterName',
                    value:'',
                },
            ],
            detailData: {numbers: ''},
            revertDetail: {},
            sysOfficeId: '',
            isShow: false,
            isSave: false,
            status: -1,
            assetBaseId: ''
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
        console.log('props',props.status,this.state.status)
        if (!props.visible) {
            return
        }
       
        if (props.numbers !== this.state.detailData['numbers'] && props.visible) {
            this.setState({
                detailData: {numbers: props.numbers},
                assetBaseId: this.props.assetBaseId
            })
        }
        if (props.status !== this.state.status && props.visible) {
            this.setState({
                status: props.status
            })
            if (props.status === 0 || props.status === 1) {
                this._getDetailData(props.keyId)
            } else {
                this.setState({
                    loading: false
                })
            }
        } else {
            this.setState({
                loading: false
            })
        }
    }
    
    _getDetailData = async (id) => { 
        try {
            const result = await HTTP.keyRecordDetail({
                keyId: id
            });
            this.setState({
                loading: false,
            })

            if (result.success) {
                let data = result.data;
                data.sysOffice = result.data['sysOffice'] && result.data['sysOffice']['name'] ? result.data['sysOffice']['name'] : '';
                data.typeId = data.type;
                switch(data.type) {
                    case '0': data.type = '房产'; break;
                    case '1': data.type = '机动车'; break;
                    case '2': data.type = '土地房产'; break;
                    default: data.type = '';
                }
                this.setState({
                    detailData: data,
                    sysOfficeId: result.data['sysOffice'] && result.data['sysOffice']['id'] ? result.data['sysOffice']['id'] : ''
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


    /**
     * @desc 添加防抖，防止连击
     * */
    _onKeyRecordSave = LodashDebounce((e) => this.onKeyRecordSave(e));
    _onReturnSubmit = LodashDebounce((e) => this.onReturnSubmit(e));
    _keyIdentify = LodashDebounce((e) => this.keyIdentify(e));

    onReturnSubmit = (e) => {        
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                message.warning('请填完必填项！');
                return;
            }
            console.log('values:', values)
            let submitParame = {};
            submitParame.keyId = this.props.keyId;
            submitParame.returnDate = values.returnDate ? values.returnDate.format('YYYY-MM-DD') : undefined;
            submitParame.remake = values.remake;
            this.setState({
                loading: true,
            })
            this.onReturnSubmitDo(submitParame)
            
        })
    }

    onReturnSubmitDo = async (data) => { 
        console.log(data)
        try {
            const result = await HTTP.keyRecordSaveReturn({
                ...data
            });
            console.log('result', result);
            this.setState({
                loading: false,
            })
            if (result.success) {
                message.success('提交成功！');
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

    onKeyRecordSave = (e) => {        
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                message.warning('请填完必填项！');
                return;
            }
            console.log('values:', values)
            let submitParame = {};
            submitParame.keyId = this.props.keyId;
            submitParame.assetBaseId = this.state.assetBaseId ? this.state.assetBaseId : '';
            submitParame.officeId = this.state.sysOfficeId;
            submitParame.numbers = values.numbers;
            submitParame.subjectMatterName = this.state.detailData['subjectMatterName'];
            submitParame.type = this.state.detailData['typeId'];
            submitParame.executorName = this.props.operator;
            submitParame.fileDate = values.fileDate ? values.fileDate.format('YYYY-MM-DD') : undefined;
            submitParame.particulars = values.particulars;
            this.setState({
                loading: true,
            })
            this._save(submitParame)
            
        })
    }
   
    _save = async (data) => { 
        console.log(data)
        try {
            const result = await HTTP.keyRecordSave({
                ...data
            });
            console.log('result', result);
            this.setState({
                loading: false,
            })
            if (result.success) {
                message.success('提交成功！');
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
   
    handleOk = (e) => {
        console.log(e);
        this.props.keyRecordsCancel(true)
    }

    handleCancel = (e) => {
        console.log(e);
        this.props.keyRecordsCancel()
    }

    keyIdentify =  (e) => { 
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                message.warning('请填完必填项！');
                return;
            }
            let submitParame = {};
            console.log('values:', values)
            submitParame.numbers = values.numbers;
            this.setState({
                loading: true,
            })
            this.keyIdentifyDo(submitParame)
        })
       
    }

    keyIdentifyDo = async (submitParame) => { 
        try {
            const result = await HTTP.keyIdentify({
                ...submitParame,
            });
            console.log('result', result);
            this.setState({
                loading: false,
            })
            if (result.success) {
                let data = result.data;
                let myData = {};
                this.setState({
                    assetBaseId: data.id ? data.id : ''
                },function(){
                    console.log('assetBaseId',this.state.assetBaseId)
                })
                myData.sysOffice = data.sysOffice && data.sysOffice['name'] ? data.sysOffice['name']: '';
                myData.subjectMatterName = data.subjectMatterName;
                myData.typeId = data.type;
                switch(data.type) {
                    case '0': myData.type = '房产'; break;
                    case '1': myData.type = '机动车'; break;
                    case '2': myData.type = '土地房产'; break;
                    default: myData.type = '';
                }
                this.setState({
                    detailData: {...this.state.detailData,...myData},
                    sysOfficeId: data.sysOffice && data.sysOffice['id'] ? data.sysOffice['id']: ''
                })
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false,
            })
        }
    }

    render() {
        const { status, isSave, showArr_2, detailData, isShow, loading, showArr, showArr_1, revertDetail } = this.state;
        const { form, visible, operator, revertoperator } = this.props;
        const { getFieldDecorator } = form;
        console.log('detailData',detailData)
        return (
            <Modal
                title="钥匙记录"
                visible={visible}
                onCancel={this.handleCancel}
                destroyOnClose={true}
                footer={null}
                width="70%"
                >
                <Spin size="large" spinning={loading}>               
                    <Form layout="inline" className={isShow  ? 'detail_box' : ''}> 
                        <DetailModuleBox title="钥匙记录" id="essential-information" className={isShow? 'detail_box' : ''}>
                            <Row>
                                <Col xl={8} lg={12} className="text_center" style={{marginBottom: '15px'}}>
                                    <span>标的物编号：</span>
                                    {status === -1 ? 
                                        <span className="show_input distinguish_input text_left" style={{border: 'none',padding: '0'}}>
                                            {getFieldDecorator('numbers')(
                                                <Input style={{width: '100%'}}/>
                                            )}
                                        </span>:
                                        <span className="show_input text_left">
                                            <span>{detailData['numbers'] ? detailData['numbers'] : ''}</span>
                                        </span>
                                    }
                                    {status === -1 && <Button size="small" type="primary"className="distinguish_btn" onClick={this._keyIdentify} >识别</Button>}
                                </Col>
                                {showArr.map((item,index)=> 
                                    <Col xl={8} lg={12} key={index} className="text_center" style={{marginBottom: '15px'}}>
                                        <span>{item.label}：</span>
                                        <span className="show_input text_left">
                                            <span>{detailData[item.fieldName] ? detailData[item.fieldName] : ''}</span>
                                        </span>
                                    </Col>
                                )}
                                <Col xl={8} lg={12} className="text_center" style={{marginBottom: '15px'}}>
                                    <span>入档日期：</span>
                                    {status === -1 ? 
                                        <span className="show_input text_left" style={{border: 'none',padding: '0'}}>
                                            {getFieldDecorator('fileDate')(
                                                <DatePicker locale={zh_CN} style={{width: '100%'}}/>
                                            )}
                                        </span>:
                                        <span className="show_input text_left">
                                            <span>{detailData['fileDate'] ? detailData['fileDate'] : ''}</span>
                                        </span>
                                    }
                                </Col>
                                {operator && showArr_1.map((item,index)=> 
                                    <Col xl={8} lg={12} key={index} className="text_center" style={{marginBottom: '15px'}}>
                                        <span>{item.label}：</span>
                                        <span className="show_input text_left">
                                            {operator}
                                        </span>
                                    </Col>
                                )}
                                <Col span={24} style={{marginBottom: '15px'}}>
                                    <span className="key_detail_label">钥匙明细：</span>
                                    {status === -1 ? 
                                        <span className="show_input key_detail_input text_left">
                                            {getFieldDecorator('particulars')(
                                                <textarea style={{width: '100%'}}/>
                                            )}
                                        </span>:
                                        <span className="show_input text_left">
                                            <span>{detailData['particulars'] ? detailData['particulars'] : ''}</span>
                                        </span>
                                    }
                                </Col>
                            </Row>
                            {status === -1 && <div className="text_center form_submit_box">
                                {
                                    !isShow && <Button type="primary" style={{marginLeft: 8}} onClick={this._onKeyRecordSave}>提交</Button>
                                }
                                <Button style={{marginLeft: 8}} onClick={this.handleCancel}>关闭</Button>
                            </div>}
                            {(status === 0 || status === 1) && <Row style={{marginTop: '45px'}}>
                                <Col xl={8} lg={12} className="text_center" style={{marginBottom: '15px'}}>
                                    <span>归还法院日期：</span>
                                    {status === 0 ? 
                                        <span className="show_input text_left" style={{width: '65%',border: 'none',padding: '0'}}>
                                            {getFieldDecorator('returnDate')(
                                                <DatePicker locale={zh_CN} style={{width: '100%'}}/>
                                            )}
                                        </span>:
                                        <span className="show_input text_left" style={{width: '65%'}}>
                                            <span>{detailData['returnDate'] ? detailData['returnDate'] : ''}</span>
                                        </span>
                                    }
                                </Col>
                                {revertoperator && showArr_2.map((item,index)=> 
                                    <Col xl={8} lg={12} key={index} className="text_center" style={{marginBottom: '15px'}}>
                                        <span>{item.label}：</span>
                                        <span className="show_input text_left">
                                            {revertoperator}
                                        </span>
                                    </Col>
                                )}
                                <Col span={24} style={{marginBottom: '15px'}}>
                                    <span className="key_detail_label">备注：</span>
                                    {status === 0 ?
                                        <span className="show_input key_detail_input text_left">
                                            {getFieldDecorator('remake')(
                                                <textarea style={{width: '100%'}}/>
                                            )}
                                        </span>:
                                        <span className="show_input text_left">
                                            <span>{detailData['remake'] ? detailData['remake'] : ''}</span>
                                        </span>
                                    }
                                </Col>
                                <Col span={24} style={{marginBottom: '15px'}}>
                                    <div className="text_center form_submit_box">
                                        {
                                            status !== 1 && <Button type="primary" style={{marginLeft: 8}} onClick={this._onReturnSubmit}>提交</Button>
                                        }
                                        <Button style={{marginLeft: 8}} onClick={this.handleCancel}>关闭</Button>
                                    </div>
                                </Col>
                            </Row>
                            }
                        </DetailModuleBox>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

const KeyRecord = Form.create()(KeyRecordForm)
export default KeyRecord
