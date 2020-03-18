import React from 'react';
import { Modal, Row, Col, Table, Card, Form, Button, message} from 'antd';
import FormSet from 'common/FormSet';
import * as HTTP from 'units/Axios';
import Province from './province';
import Type from './type';
// const _tableWidth = 100/15+'%';
const _tableWidth = '';
const columnsAlign = 'center';

class CheckSystemForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checkId: '0',
            visible: false,
            numbers: '',
            loading: true,
            tableListDataSource: [],
            pageInfo: {pageNumber: '1', pageSize: '10'},
            searchInfo: {status: 5},
            pagination: {total: 1, pageSize: 10, current: 1},
            ModalBodyStyle: {
                textAlign: 'center',
                fontSize: '17px'
            },
            searchArr: [
                {
                    label: '标的物所在地',
                    child: [
                        {
                            fieldName: 'province',
                            value: Province,
                            style: 'select'
                        }
                    ],
                },
                {
                    label: '法院',
                    child: [
                        {
                            fieldName: 'handleUnit',
                            value:'',
                            style: 'input'
                        }
                    ],
                },
                {
                    label: '标的物名称',
                    child: [
                        {
                            fieldName: 'bidName',
                            value:'',
                            style: 'input'
                        }
                    ],
                },
                {
                    label: '标的物类型',
                    child: [
                        {
                            fieldName: 'type',
                            value: Type,
                            style: 'select'
                        }
                    ],
                },
                {
                    label: '操作',
                    child: [
                        {
                            fieldName: 'status',
                            value: [
                                {
                                    value: '0',
                                    text: '未处理',
                                },
                                {
                                    value: '1',
                                    text: '已处理',
                                },
                            ],
                            style: 'select'
                        }
                    ],
                },
            ],
            columns:[
                {
                    title: '开拍时间',
                    align: columnsAlign,
                    dataIndex: 'startTime',
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
                    title: '标的物类型',
                    align: columnsAlign,
                    dataIndex: 'type',
                    width: _tableWidth,
                    render: (text) => text || text === 0 ? Type[text]['text'] : '--'
                },
                {
                    title: '处置单位',
                    align: columnsAlign,
                    dataIndex: 'handleUnit',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '评估价',
                    align: columnsAlign,
                    dataIndex: 'assessPrice',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '起拍价',
                    align: columnsAlign,
                    dataIndex: 'startPrice',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '保证金',
                    align: columnsAlign,
                    dataIndex: 'bondPrice',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '加价幅度',
                    align: columnsAlign,
                    dataIndex: 'rateLadder',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '竞价周期',
                    align: columnsAlign,
                    dataIndex: 'biddingCycle',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '延时周期',
                    align: columnsAlign,
                    dataIndex: 'delayedTime',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '拍卖时间',
                    align: columnsAlign,
                    dataIndex: 'endTime',
                    width: _tableWidth,
                    render: (text,record) => this.auctionTimeDo(text,record.startTime)
                },
                // {
                //     title: '拍卖状态',
                //     align: columnsAlign,
                //     dataIndex: 'auctionStatus',
                //     width: _tableWidth,
                //     render: (text) => text || text === 0 ? this.auctionStatusDo(text) : '--'
                // },
                {
                    title: '联系方式',
                    align: columnsAlign,
                    dataIndex: 'number',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '错误详情',
                    align: columnsAlign,
                    dataIndex: 'message',
                    // width: _tableWidth,
                    render: (text,record) => text ? text : '--'
                },
                {
                    title: '操作',
                    align: columnsAlign,
                    dataIndex: 'status',
                    width: 120,
                    fixed: 'right',
                    render: (text,record) => <span>
                            {text === 0 ? 
                                <span className="red-style cursor_pointer" onClick={this.editDetail.bind(this,record.id)}>处理</span>:
                                <span>已处理</span>
                            }
                            <span style={{marginLeft: '15px'}} className="cursor_pointer" onClick={this.openLink.bind(this,record.link)}>查看</span>
                        </span>
                },
            ],
        }
    }

    componentDidMount() { //预加载数据
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
    auctionTimeDo = (startTime,endTime) => {
        if (startTime || endTime) {
            startTime = startTime ? startTime : '--';
            endTime = endTime ? endTime : '--';
            return startTime + '~' + endTime;
        } else {
            return '--';
        }
        
        
    }
    auctionStatusDo = (text) => {
        let showText = '';
        switch (text) {
            case 0: showText = '正在进行';break;
            case 1: showText = '即将开始';break;
            default: showText = '--';
        }
        return showText
    }

    handleSearch = (e) => { //查询请求
        this.setState({
            loading: true
        })
        e ? e.preventDefault(): null;
        this.props.form.validateFields((err, values) => {

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
            const result = await HTTP.checkSystemList({
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
            this.loadlists({...this.state.pageInfo, ...this.state.searchInfo})
        })
    }

    editDetail = (id) => { //处理
        this.setState({
            visible: true,
            checkId: id
        });
    }

    openLink = (link) => {//查看
        if (link) {
            window.open(link) 
        }
    }

    handleOk = async () => { //处理
        try {
            const result = await HTTP.checkUpdateStatus({
                checkId: this.state.checkId
            });
            console.log('result', result);
            this.setState({
                visible: false
            })
            if (result.success) {
                message.success('操作成功！');
                this.handleFormReset();
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                visible: false
            })
        }
    }
    
    handleCancel = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        });
    }
    
    render() {
        return (
            <div className="table-list">
                <Card bordered={false}>
                        <Form onSubmit={this.handleSearch} layout="inline" className="ant-search-form">
                            <FormSet form={this.props.form}  searchArr={this.state.searchArr}/>
                            <Row>
                                <Col xl={12} lg={24}>
                                    <span style={{float: 'left'}}>
                                        <Button htmlType="submit" type="primary">查询</Button>
                                        <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
                                    </span>
                                </Col>
                            </Row>
                        </Form>
                        <Table scroll={{ x: 2150 }} bordered rowKey="id" columns={this.state.columns}
                                dataSource={this.state.tableListDataSource} loading={this.state.loading}
                                onChange={this.pageJump} pagination={this.state.pagination}/>
                </Card>
                <Modal
                    title=""
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消"
                    >
                    <div className="text_center" style={{marginTop: '15px'}}>是否标记为已处理</div>
                </Modal>
            </div>
        )
    }
}

const CheckSystem = Form.create()(CheckSystemForm)
export default CheckSystem
