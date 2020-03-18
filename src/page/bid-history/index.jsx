import React from 'react';
import { Popover, Row, Col, Table, Card, Form, Button, message} from 'antd';
import FormSet from 'common/FormSet';
import OperationProcessTable from 'common/operationProcessTable';
import * as HTTP from 'units/Axios';
import {inject, observer} from 'mobx-react';
import cloneDeep from 'lodash/cloneDeep';
// const _tableWidth = 100/17+'%';
const _tableWidth = '';
const columnsAlign = 'center';

@inject('assetAdd')
@observer
class BidHistoryForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchInfo: {},
            numbers: '',
            loading: true,
            tableListDataSource: [],
            pageInfo: {pageNumber: '1', pageSize: '10'},
            pagination: {total: 1, pageSize: 10, current: 1},
            ModalBodyStyle: {
                textAlign: 'center',
                fontSize: '17px'
            },
            searchArr: [
                {
                    label: '标的物',
                    child: [
                        {
                            fieldName: 'bidName',
                            style: 'input'
                        }
                    ],
                },
                
                {
                    label: '监拍日期',
                    child: [
                        {
                            fieldName: 'suggestTime',
                            value:'',
                            format: 'YYYY-MM-DD',
                            style: 'dataRange'
                        }
                    ],
                },
            ],
            columns:[
                {
                    title: '监拍时间',
                    align: columnsAlign,
                    dataIndex: 'createTime',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
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
                    dataIndex: 'bidName',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '监拍状态',
                    align: columnsAlign,
                    dataIndex: 'inspect',
                    width: 140,
                    render: (text,record) => ((text || text === 0 ) && (record.status || record.status === 0)) ? this._supervisorShow(text,record.status) : '--'
                },
                {
                    title: '达标情况',
                    align: columnsAlign,
                    dataIndex: 'standrad',
                    width: 140,
                    render: (text,record) => ((text || text === 0 ) && (record.status || record.status === 0)) ? this._suggestShow(text,record.status) : '--'
                },
                {
                    title: '意见建议',
                    align: columnsAlign,
                    dataIndex: 'opinion',
                    width: 140,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '监拍人',
                    align: columnsAlign,
                    dataIndex: 'user.name',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
            ],
        }
    }

    componentDidMount() { //预加载数据
        // this.loadlists(this.state.pageInfo) //获取数据列表
        this.handleSearch();
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

    _suggestShow = (standrad,status) => {
        let showText = null;
        let supervisor = '';
        switch (standrad) {
            case 0: supervisor = '未达标';break;
            case 1: supervisor = '达标';break;
            default: supervisor = '--';
        }
        let statusText = '';
        switch (status) {
            case 0: statusText = '开始';break;
            case 1: statusText = '结束';break;
            default: statusText = '--';
        }
        showText = <div>{supervisor}（{statusText}）</div>
        return showText
    }
    _supervisorShow = (inspect,status) => {
        let showText = null;
        let supervisor = '';
        switch (inspect) {
            case 0: supervisor = '未监拍';break;
            case 1: supervisor = '已监拍';break;
            default: supervisor = '--';
        }
        let statusText = '';
        switch (status) {
            case 0: statusText = '开始';break;
            case 1: statusText = '结束';break;
            default: statusText = '--';
        }
        showText = <div>{supervisor}（{statusText}）</div>
       
        return showText
    }

    _assetStatus = (text,id) => {
        let assetStatusList = sessionStorage.getItem('assetStatusList') ? JSON.parse(sessionStorage.getItem('assetStatusList')) : []
        let assetStatus = ''
        for (let item of assetStatusList) {
            if (item.status === text) {
                assetStatus = item.name
            }
        }
        
        const content = <OperationProcessTable assetBaseId={id}/>
        const showText = <Popover content={content} title="流程"><span className="status_box">{assetStatus}</span></Popover>
        return showText
    }
    handleSearch = (e) => { //查询请求
        this.setState({
            loading: true
        })
        e ? e.preventDefault(): null;
        this.props.form.validateFields((err, values) => {
            console.log(values)
            
            
            if (values.suggestTime) {
                values.startTime = values.suggestTime[0] ?  values.suggestTime[0].format('YYYY-MM-DD') : '';
                values.endTime = values.suggestTime[1] ?  values.suggestTime[1].format('YYYY-MM-DD') : '';
            }
            values.suggestTime = undefined;

            this.setState({
                tableListDataSource: [],
                searchInfo: {...this.state.searchInfo, ...values},
                pagination: {total: 1, pageSize: 10, current: 1},
                pageInfo: {pageNumber: '1', pageSize: '10'},
            }, function () {
                this.loadlists({...this.state.pageInfo, ...this.state.searchInfo})
            })
        });
    }

    loadlists = async (data) => { //请求数据函数
        console.log(data)
        try {
            const result = await HTTP.supervisorHistoryList({
                ...data
            });
            console.log('result', result);
            this.setState({
                loading: false
            })
            
            if (result.success) {
                this.setState({
                    tableListDataSource: result.data['list'],
                    pagination: {...this.state.pagination, total: result.data.total},
                })
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
    handleFormReset = () => { //重置查询
        this.setState({
            loading: true
        })
        this.props.form.resetFields()
        this.setState({
            tableListDataSource: [],
            pageInfo: {pageNumber: '1', pageSize: '10'},
            pagination: {total: 1, pageSize: 10, current: 1},
            searchInfo: {}
        }, function () {
            this.loadlists(this.state.pageInfo)
        })
    }

    render() {
        return (
            <div className="table-list">
                <Card bordered={false}>
                        <Form onSubmit={this.handleSearch} layout="inline" className="ant-search-form">
                            <FormSet form={this.props.form} searchArr={this.state.searchArr}/>
                            <Row>
                                <Col xl={12} lg={24}>
                                    <span style={{float: 'left'}}>
                                        <Button htmlType="submit" type="primary">查询</Button>
                                        <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
                                    </span>
                                </Col>
                            </Row>
                        </Form>
                        <Table bordered rowKey="id" columns={this.state.columns}
                                dataSource={this.state.tableListDataSource} loading={this.state.loading}
                                onChange={this.pageJump} pagination={this.state.pagination}/>
                </Card>
            </div>
        )
    }
}

const BidHistory = Form.create()(BidHistoryForm)
export default BidHistory
