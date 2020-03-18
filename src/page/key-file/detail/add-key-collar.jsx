import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Button, message, Spin, Modal, Row, Col, DatePicker, Table } from 'antd';
import DetailModuleBox from 'common/DetailModuleBox';
import LodashDebounce from 'common/debounce';
import KeyCollarRevert from './key-collar-revert.jsx';
import * as HTTP from 'units/Axios';
import 'components/AssetDetail/index.less';
import zh_CN from 'antd/lib/date-picker/locale/zh_CN';
import './index.less'

const _tableWidth = 100/9+'%';
const columnsAlign = 'center';

class AddKeyCollarForm extends React.Component {
    static propTypes = {
        visible: PropTypes.bool,
        addKeyCollarCancel: PropTypes.func,
        keyId: PropTypes.string,
    };

    static defaultProps = {
        keyId: '',
        visible: false,
        addKeyCollarCancel: ()=>{},
    };
    constructor(props) {
        super(props)
        this.state = {
            tableLoading: true,
            tableListDataSource: [],
            loading: true,
            columns: [
                {
                    title: '领用人',
                    align: columnsAlign,
                    dataIndex: 'receiveUser',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '领用原因',
                    align: columnsAlign,
                    dataIndex: 'receiveReason',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '领用日期',
                    align: columnsAlign,
                    dataIndex: 'receiveDate',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '归还日期',
                    align: columnsAlign,
                    dataIndex: 'returnData',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '领用备注',
                    align: columnsAlign,
                    dataIndex: 'receiveRemake',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '归还备注',
                    align: columnsAlign,
                    dataIndex: 'returnRemake',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '领用操作人',
                    align: columnsAlign,
                    dataIndex: 'sysUser.name',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '归还操作人',
                    align: columnsAlign,
                    dataIndex: 'returnUser.name',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '操作',
                    align: columnsAlign,
                    dataIndex: 'status',
                    width: _tableWidth,
                    render: (text,record) => <span> {text === 0 ? <Button size="small" onClick={this.keyRecordRevertShow.bind(this,record.id)}>归还</Button>: '--'}</span>
                      
                },
            ],
            revertDetail: {},
            assetBaseId: '',
            isShow: false,
            keyCollarRevertVisible: false,
            keyId: '',
            historyId: ''
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
        
        if (props.keyId !== this.state.keyId && props.visible) {
            this.setState({
                keyId: props.keyId,
                tableListDataSource: []
            },function(){
                this._getListData(props.keyId)
            })
        } else {
            this.setState({
                tableLoading: false,
                loading: false
            })
        }
        
    }

    keyRecordRevertShow = (id) => {
        this.setState({
            keyCollarRevertVisible: true,
            historyId: id ? id :''
        })
    }
    
    _getListData = async (id) => { 
        try {
            const result = await HTTP.keyCollarList({
                keyId: id,
            });
            this.setState({
                loading: false,
                tableLoading: false,
            })
            if (result.success) {
                this.setState({
                    tableListDataSource: result.data
                })
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false,
                tableLoading: false,
            })
        }
    }


    /**
     * @desc 添加防抖，防止连击
     * */
    _onSubmit = LodashDebounce((e) => this.handleSave(e));

    handleSave = (e) => {        
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                message.warning('请填完必填项！');
                return;
            }
            console.log('values:', values)
            values.receiveDate = values.receiveDate ? values.receiveDate.format('YYYY-MM-DD') : undefined; 
            this.setState({
                loading: true,
                tableLoading: true
            })
          
            this._save(values)
            
        })
    }
   
    _save = async (data) => { 
        console.log(data)
        try {
            const result = await HTTP.keyCollarSave({
                ...data,
                keyId: this.state.keyId
            });
            console.log('result', result);
            this.setState({
                loading: false
            })
            if (result.success) {
                message.success('提交成功！');
                this.handleOk();
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false
            })
        }
    }
   
    handleOk = (e) => {
        console.log(e);
        this.props.addKeyCollarCancel(true)
    }

    handleCancel = (e) => {
        console.log(e);
        this.props.addKeyCollarCancel()
    }

    keyCollarRevertCancel = () => {
        this.setState({
            keyCollarRevertVisible: false,
            tableLoading: true,
        },function(){
            this._getListData(this.state.keyId)
        })
    }

    render() {
        const { historyId, tableLoading, tableListDataSource, columns, keyCollarRevertVisible, isShow, loading } = this.state;
        const { form, visible } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                title="新增领用"
                visible={visible}
                onCancel={this.handleCancel}
                destroyOnClose={true}
                footer={null}
                width="70%"
                >
                <Spin size="large" spinning={loading}>               
                    <Form layout="inline" className={isShow  ? 'detail_box' : ''}> 
                        <DetailModuleBox title="新增领用" id="essential-information" className={isShow? 'detail_box' : ''}>
                            <Row>
                                <Col xl={8} lg={12} className="text_center" style={{marginBottom: '15px'}}>
                                    <span>领用人：</span>
                                    <span className="show_input text_left" style={{border: 'none',padding: '0'}}>
                                        {getFieldDecorator('receiveUser')(
                                            <Input style={{width: '100%'}}/>
                                        )}
                                    </span>
                                </Col>
                                <Col xl={8} lg={12} className="text_center" style={{marginBottom: '15px'}}>
                                    <span>领用原因：</span>
                                    <span className="show_input text_left" style={{border: 'none',padding: '0'}}>
                                        {getFieldDecorator('receiveReason')(
                                            <Input style={{width: '100%'}}/>
                                        )}
                                    </span>
                                </Col>
                                <Col xl={8} lg={12} className="text_center" style={{marginBottom: '15px'}}>
                                    <span>领用日期：</span>
                                    <span className="show_input text_left" style={{border: 'none',padding: '0'}}>
                                        {getFieldDecorator('receiveDate')(
                                            <DatePicker locale={zh_CN} style={{width: '100%'}}/>
                                        )}
                                    </span>
                                </Col>
                                <Col span={24} style={{marginBottom: '15px'}}>
                                    <span className="key_detail_label key_detail_label_1">备注：</span>
                                    <span className="show_input key_detail_input text_left">
                                        {getFieldDecorator('receiveRemake')(
                                            <textarea style={{width: '100%'}}/>
                                        )}
                                    </span>
                                </Col>
                            </Row>
                            <div className="text_center form_submit_box">
                                {
                                    !isShow && <Button type="primary" style={{marginLeft: 8}} onClick={this._onSubmit}>提交</Button>
                                }
                                <Button style={{marginLeft: 8}} onClick={this.handleCancel}>关闭</Button>
                            </div>
                        </DetailModuleBox>
                    </Form>
                </Spin>
                <Table bordered rowKey="id" columns={columns} 
                    dataSource={tableListDataSource} loading={tableLoading} pagination={false}
                />
                <KeyCollarRevert historyId={historyId} visible={keyCollarRevertVisible} keyCollarRevertCancel={this.keyCollarRevertCancel}/>
            </Modal>
        )
    }
}

const AddKeyCollar = Form.create()(AddKeyCollarForm)
export default AddKeyCollar
