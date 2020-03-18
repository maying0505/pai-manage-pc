import React from 'react'
import {Divider, Modal, Icon, Row, Col, Table, Card, Form, Input, Select, Button, message} from 'antd'
// import {hashHistory} from 'react-router'


const FormItem = Form.Item
const Option = Select.Option
const _tableWidth = '7%';

class AdvancedSearchForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableListDataSource: [],
            pageInfo: {pageNo: '1', pageSize: '10'},
            searchInfo: {},
            pagination: {total: 1, pageSize: 10, current: 1},
            ModalBodyStyle: {
                textAlign: 'center',
                fontSize: '17px'
            },
            columns: [
                {
                    title: '姓名',
                    dataIndex: 'name',
                    // fixed: 'left',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '合同编号',
                    dataIndex: 'productBy.contractNo',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '身份证号',
                    dataIndex: 'certificateNo',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '手机号',
                    dataIndex: 'phone',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '产品',
                    dataIndex: 'productBy.proName',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '借款金额（元）',
                    dataIndex: 'productBy.lendMoney',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '申请时间',
                    dataIndex: 'enteringDate',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '分公司',
                    dataIndex: 'companyBy.name',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '业务员',
                    dataIndex: 'productBy.salesman',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
            ],
        }
    }

    componentDidMount() { //预加载数据
        this.loadlists(this.state.pageInfo) //获取数据列表
    }

    pageJump = (e) => { //分页跳转
        console.log(e)
        this.setState({
            pageInfo: {pageNo: e.current, pageSize: e.pageSize},
            pagination: {...this.state.pagination, current: e.current}
        }, function () {
            this.loadlists({...this.state.pageInfo, ...this.state.searchInfo})
        })
    }
    handleSearch = (e) => { //查询请求
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (values.filingDate) {
                values.filingDate = values.filingDate.format('YYYY-MM-DD HH:mm:ss')
            }
            if (values.proName) {
                values.proName = values.proName.split('-')[0]
            }
            this.setState({
                searchInfo: {...this.state.searchInfo, ...values},
                pagination: {total: 1, pageSize: 10, current: 1},
                pageInfo: {pageNo: '1', pageSize: '10'},
            }, function () {
                this.loadlists({...this.state.pageInfo, ...this.state.searchInfo})
            })
        });
    }

    loadlists(data) { //请求数据函数
        console.log(data)
        // request(api.loanApplicationList, data, 'post', session.get('token'))
        //     .then(res => {
        //         console.log(JSON.stringify(res))
        //         this.setState({loading: false})
        //         if (res.success) {
        //             this.setState({
        //                 tableListDataSource: res.data.list,
        //                 pagination: {...this.state.pagination, total: res.data.total},
        //                 loading: false
        //             });
        //         }
        //     })
        //     .catch(err => {
        //         console.log(err)
        //         this.setState({loading: false})
        //     })
    }

    handleFormReset = () => { //重置查询
        this.setState({
            loading: true
        })
        this.props.form.resetFields()
        this.setState({
            pageInfo: {pageNo: '1', pageSize: '10'},
            pagination: {total: 1, pageSize: 10, current: 1},
            searchInfo: {}
        }, function () {
            this.loadlists(this.state.pageInfo)
        })
    }

    addTableRow() { //新建
        // hashHistory.push('/loan-application/loan-application-detail/null/null/0')
    }

    renderAdvancedForm() { //查询条件DOM
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline" className="ant-search-form">
                <Row>
                    <Col xl={6} lg={12}>
                        <FormItem label="客户姓名">
                            {getFieldDecorator('name')(
                                <Input placeholder="请输入"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col xl={6} lg={12}>
                        <FormItem label="业务员">
                            {getFieldDecorator('salesman')(
                                <Input placeholder="请输入"/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col xl={12} lg={24}>
                        <span style={{float: 'left'}}>
                            <Button htmlType="submit" type="primary" size="small">查询</Button>
                            <Button style={{marginLeft: 8}} onClick={this.handleFormReset} size="small">重置</Button>
                        </span>
                    </Col>
                    <Col xl={12} lg={24}>
                        <span style={{float: 'right'}}>
                            <Button onClick={this.addTableRow} type="primary" size="small"><Icon type="plus" /><span>新增标的</span></Button>
                        </span>
                    </Col>
                </Row>
                <div style={{overflow: 'hidden'}}>
                   
                </div>
            </Form>
        );
    }

  render() {
    return (
      <div className="table-list">
        <Card bordered={false}>
                    <div>{this.renderAdvancedForm()}</div>
                    <Table rowKey="ident" bordered columns={this.state.columns}
                           dataSource={this.state.tableListDataSource} loading={this.state.loading}
                           onChange={this.pageJump} pagination={this.state.pagination}/>
                </Card>
            </div>
        )
    }
}

const UForm = Form.create()(AdvancedSearchForm)
export default UForm
