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
class BidSuggestForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // searchArrValues: sessionStorage.getItem('_searchArrValues') ? JSON.parse(sessionStorage.getItem('_searchArrValues')): {},
            numbers: '',
            loading: true,
            tableListDataSource: [],
            pageInfo: sessionStorage.getItem('_ifBack') === '0' && sessionStorage.getItem('_pageInfo') ? JSON.parse(sessionStorage.getItem('_pageInfo')) : {pageNumber: '1', pageSize: '10'},
            searchInfo: sessionStorage.getItem('_ifBack') === '0' && sessionStorage.getItem('_searchInfo') ? JSON.parse(sessionStorage.getItem('_searchInfo')) : {},
            pagination: sessionStorage.getItem('_ifBack') === '0' && sessionStorage.getItem('_pagination') ? JSON.parse(sessionStorage.getItem('_pagination')) : {total: 1, pageSize: 10, current: 1},
            ModalBodyStyle: {
                textAlign: 'center',
                fontSize: '17px'
            },
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
                    label: '监拍状态',
                    child: [
                        {
                            fieldName: 'supervisor',
                            value: [
                                {
                                    value: 0,
                                    text: '未监拍',
                                },
                                {
                                    value: 1,
                                    text: '已监拍',
                                },
                            ],
                            style: 'select'
                        }
                    ],
                },
                {
                    label: '达标状态',
                    child: [
                        {
                            fieldName: 'standard',
                            value: [
                                {
                                    value: 0,
                                    text: '未达标',
                                },
                                {
                                    value: 1,
                                    text: '达标',
                                },
                            ],
                            style: 'select'
                        }
                    ],
                },
                {
                    label: '昨日新增预约人数',
                    child: [
                        {
                            fieldName: 'mixNumber',
                            value:'',
                            style: 'input',
                            unit: '至',
                        },
                        {
                            fieldName: 'maxNumber',
                            value:'',
                            style: 'input'
                        }
                    ],
                },
            ],
            columns:[
                {
                    title: '移交时间',
                    align: columnsAlign,
                    dataIndex: 'transferDate',
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
                    title: '法官',
                    align: columnsAlign,
                    dataIndex: 'sysUser.name',
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
                    dataIndex: 'subjectMatterName',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '被执行人姓名',
                    align: columnsAlign,
                    dataIndex: 'executorName',
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
                    title: '归属地区',
                    align: columnsAlign,
                    dataIndex: 'city',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '评估价',
                    align: columnsAlign,
                    dataIndex: 'evaluationPrice',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '起拍价',
                    align: columnsAlign,
                    dataIndex: 'startintPrice',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '成交价',
                    align: columnsAlign,
                    dataIndex: 'finalPrice',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '拍卖时间',
                    align: columnsAlign,
                    dataIndex: 'auctionTime',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '看样时间及人员',
                    align: columnsAlign,
                    dataIndex: 'seeingTime',
                    width: 350,
                    render: (text) => text ? this.seeingTimeDo(text) : '--'
                },
                {
                    title: '状态',
                    align: columnsAlign,
                    dataIndex: 'status',
                    width: _tableWidth,
                    render: (text,record) => text || text === 0 ? this._assetStatus(text,record.id) : '--'
                },
                {
                    title: '预约人数（昨日新增）',
                    align: columnsAlign,
                    dataIndex: 'reserveNumber',
                    width: _tableWidth,
                    render: (text,record) => this.reserveNumberDo(text,record) 
                },
                {
                    title: '实到人数',
                    align: columnsAlign,
                    dataIndex: 'reallyNumber',
                    width: _tableWidth,
                    render: (text) => text || text === 0 ? text : '--'
                },
                {
                    title: '监拍状态',
                    align: columnsAlign,
                    dataIndex: 'supervisor',
                    width: 140,
                    render: (text,record) => this._supervisorShow(record.assetSupervisors)
                },
                {
                    title: '达标情况',
                    align: columnsAlign,
                    dataIndex: 'standard',
                    width: 140,
                    render: (text,record) => this._suggestShow(record.assetSupervisors)
                },
                {
                    title: '操作',
                    align: columnsAlign,
                    dataIndex: 'id',
                    width: 120,
                    fixed: 'right',
                    render: (text,record) => this.operationShow(text,record)
                      
                },
            ],
        }
    }

    componentDidMount() { //预加载数据
        sessionStorage.removeItem('_ifBack');
        this.loadlists({...this.state.pageInfo, ...this.state.searchInfo}) //获取数据列表
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

    reserveNumberDo = (text,record) => {
        return <span>{text || text === 0 ? text: '--'}         ({record.count || record.count === 0 ? <span className="red-style">{record.count}</span> : '--'})</span>
    }
    seeingTimeDo = (text) => {
        let json = JSON.parse(text);
        return json.map((item,index)=>
            <div>{item.seeingTime ? item.seeingTime : '--'} 至 {item.endTime ? item.endTime : '--'}<br></br>{item.userName ? item.userName : '--'}</div>
        )
    }
    operationShow = (text,record) => {
        let assetSupervisors = record.assetSupervisors;
        let showText = null;
        if (assetSupervisors) {
            for (let item of assetSupervisors) {
                let status = '';
                switch (item.status) {
                    case 0: status = '开始';break;
                    case 1: status = '结束';break;
                    default: status = '--';
                }
                if (item.standard === 1 && item.supervisor === 1) {
                    showText = <div>{showText}<div className="cursor_pointer" onClick={this.editDetail.bind(this,text,status,item.id,record.status,record.type,record.inquestIdTwo,status,'1')}>详情（{status}）</div></div>
                } else {
                    showText = <div>{showText}<div className="green_color" onClick={this.editDetail.bind(this,text,status,item.id,record.status,record.type,record.inquestIdTwo,status,'0')}>监拍（{status}）</div></div>
                }
            }
            
        } else {
            showText = '--';
        }
        return showText
    }
    _suggestShow = (assetSupervisors) => {
        let showText = null;
        if (assetSupervisors) {
            for (let item of assetSupervisors) {
                let standard = '';
                switch (item.standard) {
                    case 0: standard = '未达标';break;
                    case 1: standard = '达标';break;
                    default: standard = '--';
                }
                let status = '';
                switch (item.status) {
                    case 0: status = '开始';break;
                    case 1: status = '结束';break;
                    default: status = '--';
                }
                showText = <div>{showText}<div>{standard}（{status}）</div></div>
            }
            
        } else {
            showText = '--';
        }
        return showText
    }
    _supervisorShow = (assetSupervisors) => {
        let showText = null;
        if (assetSupervisors) {
            for (let item of assetSupervisors) {
                let supervisor = '';
                switch (item.supervisor) {
                    case 0: supervisor = '未监拍';break;
                    case 1: supervisor = '已监拍';break;
                    default: supervisor = '--';
                }
                let status = '';
                switch (item.status) {
                    case 0: status = '开始';break;
                    case 1: status = '结束';break;
                    default: status = '--';
                }
                showText = <div>{showText}<div>{supervisor}（{status}）</div></div>
            }
            
        } else {
            showText = '--';
        }
        return showText
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
            // this.setState({
            //     searchArrValues: {'mixNumber': values.mixNumber,'maxNumber': values.maxNumber}
            // },function(){
            //     console.log('searchArrValues',this.state.searchArrValues)
            // })
            if (values.auctionTime) {
                values.startAuctionTime = values.auctionTime[0] ?  values.auctionTime[0].format('YYYY-MM-DD HH:mm:ss') : undefined;
                values.endAuctionTime = values.auctionTime[1] ?  values.auctionTime[1].format('YYYY-MM-DD HH:mm:ss') : undefined;
            }
            if (values.transferDate) {
                values.startTransferDate = values.transferDate[0] ?  values.transferDate[0].format('YYYY-MM-DD HH:mm:ss') : undefined;
                values.endTransferDate = values.transferDate[1] ?  values.transferDate[1].format('YYYY-MM-DD HH:mm:ss') : undefined;
            }
            if (values.seeingTime) {
                values.startseeingTime = values.seeingTime[0] ?  values.seeingTime[0].format('YYYY-MM-DD HH:mm:ss') : undefined;
                values.endseeingTime = values.seeingTime[1] ?  values.seeingTime[1].format('YYYY-MM-DD HH:mm:ss') : undefined;
            }
            values.auctionTime = undefined;
            values.transferDate = undefined;
            values.seeingTime = undefined;
            
            if (values.courtJudge) { //法院法官
                values.officeProvince = values.courtJudge[0];
                values.officeCity = values.courtJudge[1];
                values.officeId = values.courtJudge[2];
                values.sysUserId = values.courtJudge[3];
            }
            values.courtJudge = undefined;

            if (values.adress) { //归属地省市区
                values.province = values.adress[0];
                values.city = values.adress[1];
                values.area = values.adress[2]
            }
            values.adress = undefined;

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
            const result = await HTTP.supervisorList({
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

    editDetail = (id,suggestStatus,suggestOpinionId,status,type,userId,statusText,ifSuggest) => { //编辑
        if (statusText === '结束' && status < 13) {
            message.warning('当前标的未结束，不可进行监拍（结束）');
            return;
        }
        sessionStorage.setItem('assetBaseId',id)
        sessionStorage.setItem('status',status)
        sessionStorage.removeItem('isRelease')
        sessionStorage.setItem('pageName','bid_suggest_detail')
        sessionStorage.setItem('suggestStatus',suggestStatus)
        sessionStorage.setItem('_searchInfo',JSON.stringify(this.state.searchInfo))
        sessionStorage.setItem('_pagination',JSON.stringify(this.state.pagination))
        sessionStorage.setItem('_pageInfo',JSON.stringify(this.state.pageInfo))
        let href = '';
        switch(type) {
            case '0': href = `/project/bid_suggest/asset_detail/house_property/${userId ? userId : null}/${ifSuggest}`;break;
            case '3': href = `/project/bid_suggest/asset_detail/other/${userId ? userId : null}/${ifSuggest}`;break;
            case '1': href = `/project/bid_suggest/asset_detail/vehicle/${userId ? userId : null}/${ifSuggest}`;break;
            case '2': href = `/project/bid_suggest/asset_detail/land/${userId ? userId : null}/${ifSuggest}`;break;
            default: href = '';break;
        }
        // sessionStorage.setItem('pageTitle','监拍详情');
        // sessionStorage.setItem('_searchArrValues',JSON.stringify(this.state.searchArrValues));
        sessionStorage.setItem('suggestOpinionId',suggestOpinionId);
        this.props.history.push(href)
    }

    rowClassNameShow = (record, index) => {
        let assetSupervisors = record.assetSupervisors;
        if (assetSupervisors && assetSupervisors[0] && assetSupervisors[1] && assetSupervisors[0]['standard'] === 1 && assetSupervisors[0]['supervisor'] === 1 && assetSupervisors[1]['standard'] === 1 && assetSupervisors[1]['supervisor'] === 1) {
            return ''
        } else if (assetSupervisors && assetSupervisors[0] && assetSupervisors[1]) {
            return 'gray_bg'
        } else {
            return ''
        }
    }
    
    render() {
        return (
            <div className="table-list">
                <Card bordered={false}>
                        <Form onSubmit={this.handleSearch} layout="inline" className="ant-search-form">
                            <FormSet form={this.props.form} defaultValues={this.state.searchInfo} searchArr={this.state.searchArr}/>
                            <Row>
                                <Col xl={12} lg={24}>
                                    <span style={{float: 'left'}}>
                                        <Button htmlType="submit" type="primary">查询</Button>
                                        <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
                                    </span>
                                </Col>
                            </Row>
                        </Form>
                        <Table rowClassName={this.rowClassNameShow} scroll={{ x: 2150 }} bordered rowKey="id" columns={this.state.columns}
                                dataSource={this.state.tableListDataSource} loading={this.state.loading}
                                onChange={this.pageJump} pagination={this.state.pagination}/>
                </Card>
            </div>
        )
    }
}

const BidSuggest = Form.create()(BidSuggestForm)
export default BidSuggest
