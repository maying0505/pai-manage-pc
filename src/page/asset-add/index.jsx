import React from 'react';
import { Popover, Icon, Row, Col, Table, Card, Form, Button, message} from 'antd';
import FormSet from 'common/FormSet';
import TransactionPrice from 'common/transactionPrice';
import OperationProcessTable from 'common/operationProcessTable';
import ImageDownload from 'components/imageDownload';
import StateChange from 'common/stateChange';
import SeeingTime from 'common/seeingTime';
import * as HTTP from 'units/Axios';
import {inject, observer} from 'mobx-react';
const uuidv1 = require('uuid/v1');

// const _tableWidth = 100/15+'%';
const _tableWidth = '';
const columnsAlign = 'center';

@inject('assetAdd')
@observer
class AssetAddForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            assetType: '0',
            imageDownloadVisible: false,
            imageDownloadId: '',
            stateChangeVisible: false,
            numbers: '',
            stateChangeId: '',
            seeingTimeVisible: false,
            seeingTimeId: '',
            transactionPriceVisible: false,
            transactionPriceId: '',
            loading: true,
            tableListDataSource: [],
            pageInfo: sessionStorage.getItem('_ifBack') === '0' && sessionStorage.getItem('_pageInfo') ? JSON.parse(sessionStorage.getItem('_pageInfo')) : {pageNumber: '1', pageSize: '10'},
            searchInfo: sessionStorage.getItem('_ifBack') === '0' && sessionStorage.getItem('_searchInfo') ? JSON.parse(sessionStorage.getItem('_searchInfo')) : {},
            pagination: sessionStorage.getItem('_ifBack') === '0' && sessionStorage.getItem('_pagination') ? JSON.parse(sessionStorage.getItem('_pagination')) : {total: 1, pageSize: 10, current: 1},
            ModalBodyStyle: {
                textAlign: 'center',
                fontSize: '17px'
            },
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
                    title: '拍卖阶段',
                    align: columnsAlign,
                    dataIndex: 'stage',
                    width: _tableWidth,
                    render: (text) => text || text === 0 ? this._stageShow(text) : '--'
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
                    // width: _tableWidth,
                    render: (text,record) => text || text === 0 ? this._assetStatus(text,record.id) : '--'
                },
                {
                    title: '操作',
                    align: columnsAlign,
                    dataIndex: 'id',
                    width: 100,
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

    operationShow = (text,record) => {
        let content = <span className="operation_list">
                    {record.status === 0 || record.status === 4 ? 
                        <Button size="small" onClick={this.editDetail.bind(this,text,record.status,record.type,'0',record.inquestIdTwo)}>修改</Button>:
                        <Button size="small" onClick={this.editDetail.bind(this,text,record.status,record.type,'0',record.inquestIdTwo)}>详情</Button>
                    }
                    <Button size="small" onClick={this.imageDownloadDo.bind(this,text,record.type)}>下载</Button>
                    <Button size="small" disabled={record.status === 6 ? false: true} onClick={this.editDetail.bind(this,text,record.status,record.type,'1',record.inquestIdTwo)}>{record.status < 7 ? '标的发布': '已发布'}</Button>
                    <Button size="small" disabled={record.status === 7 ? false: true} onClick={this.seeingTime.bind(this,text)}>看样时间</Button>
                    <Button size="small" disabled={record.status === 13 ? false: true} onClick={this.transactionPrice.bind(this,text)}>成交价</Button>
                    <Button size="small" onClick={this.stateChange.bind(this,text,record.number)}>状态更改</Button>
                </span>
        let contentBox = <Popover placement="topLeft" content={content} arrowPointAtCenter>
                <Button><Icon type="ellipsis" /></Button>
            </Popover>
        return contentBox
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
    seeingTimeDo = (text) => {
        let json = JSON.parse(text);
        return json.map((item,index)=>
            <div>{item.seeingTime ? item.seeingTime : '--'} 至 {item.endTime ? item.endTime : '--'}<br></br>{item.userName ? item.userName : '--'}</div>
        )
    }
    _stageShow = (text) => {
        let showText = '';
        switch (text) {
            case 0: showText = '第一次拍卖';break;
            case 1: showText = '第二次拍卖';break;
            case 2: showText = '变卖';break;
            default: showText = '--';
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
                searchInfo: {...this.state.searchInfo, ...values},
                pagination: {total: 1, pageSize: 10, current: 1},
                pageInfo: {pageNumber: '1', pageSize: '10'},
                tableListDataSource: [],
            }, function () {
                console.log(this.state.searchInfo)
                this.loadlists({...this.state.pageInfo, ...this.state.searchInfo})
            })
        });
    }

    loadlists = async (data) => { //请求数据函数
        console.log('this.state.pageInfo',this.state.pageInfo)
        console.log(data)
        try {
            const result = await HTTP.bidListGet({
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
            pageInfo: {pageNumber: '1', pageSize: '10'},
            pagination: {total: 1, pageSize: 10, current: 1},
            searchInfo: {},
            tableListDataSource: [],
        }, function () {
            this.loadlists(this.state.pageInfo)
        })
    }

    addTableRow = () => { //新建
        sessionStorage.setItem('assetBaseId',uuidv1())
        sessionStorage.setItem('status','0')
        sessionStorage.removeItem('isRelease')
        sessionStorage.setItem('pageName','asset_add_detail')
        sessionStorage.setItem('pageTitle','标的录单');
        this.props.history.push('/project/asset_add/asset_detail/1/house_property')
    }

    editDetail = (id,status,type,isRelease,userId) => { //编辑
        // const { changeAssetBaseId } = this.props.assetAdd;
        // changeAssetBaseId(id)
        sessionStorage.setItem('assetBaseId',id)
        sessionStorage.setItem('status',status)
        sessionStorage.setItem('isRelease',isRelease)
        sessionStorage.setItem('pageName','asset_add_detail')
        sessionStorage.setItem('_searchInfo',JSON.stringify(this.state.searchInfo))
        sessionStorage.setItem('_pagination',JSON.stringify(this.state.pagination))
        sessionStorage.setItem('_pageInfo',JSON.stringify(this.state.pageInfo))
        let href = '';
        switch(type) {
            case '0': href = `/project/asset_add/asset_detail/house_property/${userId ? userId : null}`;break;
            case '3': href = `/project/asset_add/asset_detail/other/${userId ? userId : null}`;break;
            case '1': href = `/project/asset_add/asset_detail/vehicle/${userId ? userId : null}`;break;
            case '2': href = `/project/asset_add/asset_detail/land/${userId ? userId : null}`;break;
            default: href = '';return;
        }
        if (isRelease === '1') {
            if (status !== 6) {
                return
            }
            sessionStorage.setItem('pageTitle','标的发布');
        } else if (status === 4) {
            sessionStorage.setItem('pageTitle','标的检查');
        } else {
            sessionStorage.setItem('pageTitle','标的详情');
        }
        
        this.props.history.push(href)
    }
    transactionPrice = (id) => { //成交价修改
        this.setState({
            transactionPriceVisible: true,
            transactionPriceId: id
        });
    }
    stateChange = (id,numbers) => { //状态更改
        this.setState({
            stateChangeVisible: true,
            stateChangeId: id,
            numbers: numbers
        });
    }
    seeingTime = (id) => { //看样时间
        this.setState({
            seeingTimeVisible: true,
            seeingTimeId: id
        });
    }

    imageDownloadDo = (id,type) => { //图片下载
        this.setState({
            assetType: type,
            imageDownloadVisible: true,
            imageDownloadId: id
        });
    }

    imageDownloadHandleCancel = () => {
        this.setState({
            imageDownloadVisible: false,
        });
    }
    
    transactionPriceHandleCancel = (ifSubmit) => {
        this.setState({
            transactionPriceVisible: false,
        },function(){
            if (ifSubmit) {
                this.handleFormReset();
            }
        });
    }
    stateChangeHandleCancel = (ifSubmit) => {
        this.setState({
            stateChangeVisible: false,
        },function(){
            if (ifSubmit) {
                this.handleFormReset();
            }
        });
    }
    seeingTimeHandleCancel = (ifSubmit) => {
        this.setState({
            seeingTimeVisible: false,
        },function(){
            if (ifSubmit) {
                this.handleFormReset();
            }
        });
    }
    
    render() {
        console.log('tableList:',this.state.tableListDataSource)
        return (
            <div className="table-list">
                <Card bordered={false}>
                        <Form onSubmit={this.handleSearch} layout="inline" className="ant-search-form">
                            <FormSet form={this.props.form} defaultValues={this.state.searchInfo}/>
                            <Row>
                                <Col xl={12} lg={24}>
                                    <span style={{float: 'left'}}>
                                        <Button htmlType="submit" type="primary">查询</Button>
                                        <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
                                    </span>
                                </Col>
                            <Col xl={12} lg={24}>
                                    <span style={{float: 'right'}}>
                                        <Button onClick={this.addTableRow} type="primary"><Icon type="plus" /><span>新增标的</span></Button>
                                    </span>
                                </Col>
                            </Row>
                        </Form>
                        <Table scroll={{ x: 2150 }} bordered rowKey="id" columns={this.state.columns}
                                dataSource={this.state.tableListDataSource} loading={this.state.loading}
                                onChange={this.pageJump} pagination={this.state.pagination}/>
                </Card>
                {this.state.imageDownloadVisible && <ImageDownload assetType={this.state.assetType} imageDownloadVisible={this.state.imageDownloadVisible} imageDownloadId={this.state.imageDownloadId} imageDownloadHandleCancel={this.imageDownloadHandleCancel} />}
                {this.state.transactionPriceVisible && <TransactionPrice transactionPriceVisible={this.state.transactionPriceVisible} transactionPriceId={this.state.transactionPriceId} transactionPriceHandleCancel={this.transactionPriceHandleCancel} />}
                {this.state.stateChangeVisible && <StateChange stateChangeVisible={this.state.stateChangeVisible} numbers={this.state.numbers} stateChangeId={this.state.stateChangeId} stateChangeHandleCancel={this.stateChangeHandleCancel}/>}
                {this.state.seeingTimeVisible && <SeeingTime seeingTimeVisible={this.state.seeingTimeVisible} seeingTimeId={this.state.seeingTimeId} seeingTimeHandleCancel={this.seeingTimeHandleCancel}/>}
            </div>
        )
    }
}

const AssetAdd = Form.create()(AssetAddForm)
export default AssetAdd
