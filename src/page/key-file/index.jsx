import React from 'react';
import { Row, Col, Table, Card, Form, Button, message, Icon } from 'antd';
import FormSet from 'common/FormSet';
import * as HTTP from 'units/Axios';
import KeyRecords from './detail/key-records';
import AddKeyCollar from './detail/add-key-collar';
import PropTypes from 'prop-types';

const _tableWidth = 100/9+'%';
const columnsAlign = 'center';

class KeyFileSearchForm extends React.Component {
    static propTypes = {
        handleFormReset: PropTypes.func,
        handleSearch: PropTypes.func,
    };

    static defaultProps = {
        handleFormReset: ()=>{},
        handleSearch: ()=>{},
    };
    constructor(props) {
        super(props)
        this.state = {
            searchArr: [
                {
                    label: '法院',
                    child: [
                        {
                            fieldName: 'court',
                            style: 'court'
                        }
                    ],
                },
                {
                    label: '标的物',
                    child: [
                        {
                            fieldName: 'numbers',
                            value:'',
                            style: 'input'
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
                    label: '入档日期',
                    child: [
                        {
                            fieldName: 'fileDate',
                            value:'',
                            format:'YYYY-MM-DD',
                            style: 'dataRange'
                        }
                    ],
                },
                {
                    label: '归还法院日期',
                    child: [
                        {
                            fieldName: 'returnDate',
                            value:'',
                            format:'YYYY-MM-DD',
                            style: 'dataRange'
                        }
                    ],
                }
            ],
        }
    }

    _handleSearch = (e) => { //查询请求
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (values.fileDate) {
                values.startFileDate = values.fileDate[0] ?  values.fileDate[0].format('YYYY-MM-DD') : '';
                values.endFileDate = values.fileDate[1] ?  values.fileDate[1].format('YYYY-MM-DD') : '';
            }
            if (values.returnDate) {
                values.startReturnDate = values.returnDate[0] ?  values.returnDate[0].format('YYYY-MM-DD') : '';
                values.endReturnDate = values.returnDate[1] ?  values.returnDate[1].format('YYYY-MM-DD') : '';
            }
            values.fileDate = undefined;
            values.returnDate = undefined;
            values.officeId = values.court ? values.court[2] : undefined;
            values.court = undefined;
            this.props.handleSearch(e,values);
        });
    }
    _handleFormReset = () => { //重置查询
        this.props.form.resetFields();
        this.props.handleFormReset();
    }
    render() {
        const { searchArr } = this.state;
        const { form } = this.props;
        return (
            <Form onSubmit={this._handleSearch} layout="inline" className="ant-search-form">
                                <FormSet form={form} searchArr={searchArr} />
                                <Row>
                                    <Col xl={12} lg={24}>
                                        <span style={{float: 'left'}}>
                                            <Button htmlType="submit" type="primary">查询</Button>
                                            <Button style={{marginLeft: 8}} onClick={this._handleFormReset}>重置</Button>
                                        </span>
                                    </Col>
                                </Row>
                            </Form>
        )
    }
}
const KeyFileSearch = Form.create()(KeyFileSearchForm);

class KeyFile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            seyRecordsStatus: -1,
            keyId: '',
            assetBaseId: '',
            revertoperator: '',
            operator: '',
            numbers: '',
            keyRecordsVisible: false,
            addKeyCollarVisible: false,
            loading: true,
            pageInfo: {pageNumber: '1', pageSize: '10'},
            searchInfo: {},
            pagination: {total: 1, pageSize: 10, current: 1},
            tableListDataSource: [],
            columns:[
                {
                    title: '标的物编号',
                    align: columnsAlign,
                    dataIndex: 'numbers',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '标的物名称',
                    align: columnsAlign,
                    dataIndex: 'subjectMatterName',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '法院',
                    align: columnsAlign,
                    dataIndex: 'sysOffice.name',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '资产类型',
                    align: columnsAlign,
                    dataIndex: 'type',
                    width: _tableWidth,
                    render: (text) => text ? this._assetType(text) : '--'
                },
                {
                    title: '入档日期',
                    align: columnsAlign,
                    dataIndex: 'fileDate',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '钥匙明细',
                    align: columnsAlign,
                    dataIndex: 'particulars',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '归还法院日期',
                    align: columnsAlign,
                    dataIndex: 'returnDate',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '领用记录',
                    align: columnsAlign,
                    dataIndex: 'id1',
                    width: _tableWidth,
                    render: (text,record) => <Button size="small" onClick={this.collarRecord.bind(this,record.id)}>编辑</Button>
                      
                },
                {
                    title: '操作',
                    align: columnsAlign,
                    dataIndex: 'id',
                    width: _tableWidth,
                    render: (text,record) => <Button size="small" onClick={this.editKeyRecord.bind(this,text,record.userOne && record.userOne['name'] ? record.userOne['name'] : '',record.numbers,record.userTwo && record.userTwo['name'] ? record.userTwo['name']: '',record.assetBase && record.assetBase['id'] ? record.assetBase['id']: '', record.status)}>{record.status === 0 ? '编辑' : '详情'}</Button>
                      
                },
            ],
        }
    }

    componentDidMount() { //预加载数据
        this.loadlists(this.state.pageInfo);
    }
    handleSearch = (e,values) => { //查询请求
        console.log('values',values)
        this.setState({
            loading: true
        })
        e ? e.preventDefault(): null;
        this.setState({
            tableListDataSource: [],
            searchInfo: {...this.state.searchInfo, ...values},
            pagination: {total: 1, pageSize: 10, current: 1},
            pageInfo: {pageNumber: '1', pageSize: '10'},
        }, function () {
            this.loadlists({...this.state.pageInfo, ...this.state.searchInfo})
        })
    }
    handleFormReset = () => { //重置查询
        this.setState({
            loading: true
        })
        this.setState({
            tableListDataSource: [],
            pageInfo: {pageNumber: '1', pageSize: '10'},
            pagination: {total: 1, pageSize: 10, current: 1},
            searchInfo: {}
        }, function () {
            this.loadlists(this.state.pageInfo)
        })
    }
    pageJump = (e) => { //分页跳转
        console.log(e)
        this.setState({
            loading: true,
            tableListDataSource: [],
            pageInfo: {pageNumber: e.current, pageSize: e.pageSize},
            pagination: {...this.state.pagination, current: e.current}
        }, function () {
            this.loadlists({...this.state.pageInfo, ...this.state.searchInfo})
        })
    }
    _assetType = (text) => {
        let assetTypeList = sessionStorage.getItem('assetTypeList') ? JSON.parse(sessionStorage.getItem('assetTypeList')) : []
        let assetType = ''
        for (let item of assetTypeList) {
            if (item.value === text) {
                assetType = item.label
            }
        }
        return assetType
    }

    

    loadlists = async (data) => { //请求数据函数
        console.log(data)
        try {
            const result = await HTTP.keyList({
                ...data
            });
            console.log('result', result);
            this.setState({
                loading: false
            })
            if (result.success) {
                this.setState({
                    tableListDataSource: result.data.list,
                    pagination: {...this.state.pagination, total: result.data.total},
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
    
    collarRecord = (id) => {//新增领用记录
        this.setState({
            addKeyCollarVisible: true,
            keyId: id? id : ''
        })
    }

    editKeyRecord = (id,operator,numbers,revertoperator,assetBaseId,seyRecordsStatus) => { //编辑钥匙记录
        console.log('addKeyRecord',operator,numbers)
        this.setState({
            seyRecordsStatus: seyRecordsStatus || seyRecordsStatus === 0? seyRecordsStatus: -1,
            revertoperator: revertoperator? revertoperator: '',
            operator: operator? operator: '',
            numbers: numbers? numbers: '',
            keyRecordsVisible: true,
            assetBaseId: assetBaseId ?assetBaseId: '',
            keyId: id? id : ''
        })
    }
    addKeyRecord = () => { //新增钥匙记录
        this.setState({
            seyRecordsStatus: -1,
            revertoperator: '',
            operator: '',
            numbers: '',
            keyRecordsVisible: true,
            assetBaseId: '',
            keyId: ''
        })
    }

    addKeyCollarCancel = (e) =>{
        this.setState({
            addKeyCollarVisible: false,
            keyId: ''
        },function(){
            if (e) {
                this.handleFormReset();
            }
        })
    }

    keyRecordsCancel = (e) =>{
        this.setState({
            keyRecordsVisible: false
        },function(){
            if (e) {
                this.handleFormReset();
            }
        })
    }
    render() {
        const { seyRecordsStatus, keyId, assetBaseId, addKeyCollarVisible, revertoperator, operator, numbers, keyRecordsVisible, tableListDataSource, columns, loading, pagination } = this.state;
        return (
            <div className="table-list">
                <Card bordered={false}>
                        <KeyFileSearch handleSearch={this.handleSearch} handleFormReset={this.handleFormReset} />
                        <div className="add_key_records">
                            <span onClick={this.addKeyRecord}>
                                <Icon type="plus" theme="filled" style={{color: '#41BE9E',fontSize: '16px',fontWeight:'bold'}} />新增钥匙记录
                            </span>
                        </div>
                        <Table bordered rowKey="id" columns={columns}
                                dataSource={tableListDataSource} loading={loading}
                                onChange={this.pageJump} pagination={pagination}/>
                        
                </Card>
                <KeyRecords status={seyRecordsStatus} keyId={keyId} assetBaseId={assetBaseId} revertoperator={revertoperator} numbers={numbers} operator={operator} visible={keyRecordsVisible} keyRecordsCancel={this.keyRecordsCancel}/>
                <AddKeyCollar keyId={keyId} visible={addKeyCollarVisible} addKeyCollarCancel={this.addKeyCollarCancel}/>
            </div>
        )
    }
}


export default KeyFile
