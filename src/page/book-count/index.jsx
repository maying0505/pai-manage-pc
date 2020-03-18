import React from 'react';
import { Popover, Table, Card, Button, message, Modal, Input, Descriptions } from 'antd';
import * as HTTP from 'units/Axios';
import DetailModuleBox from 'common/DetailModuleBox';
import LodashDebounce from 'common/debounce';
import OperationProcessTable from 'common/operationProcessTable';
import './index.less';
const _tableWidth = '';
const columnsAlign = 'center';

class BookCount extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            seeingTime: '',
            bidNumbers: '',
            bidName: '',
            questionValue: '',
            answerVisible: false,
            questionVisible: false,
            questionId: '',
            loading: true,
            loading1: false,
            tableListDataSource: [],
            tableListDataSource1: [],
            pageInfo: {pageNumber: '1', pageSize: '10'},
            searchInfo: {},
            pagination: {total: 1, pageSize: 10, current: 1},
            columns2: [
                {
                    title: '序号',
                    align: columnsAlign,
                    dataIndex: 'no',
                    width: _tableWidth,
                    render:(text,record,index)=>`${index+1}`
                },
                {
                    title: '姓名',
                    align: columnsAlign,
                    dataIndex: 'name',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '手机号',
                    align: columnsAlign,
                    dataIndex: 'mobile',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '状态',
                    align: columnsAlign,
                    dataIndex: 'status',
                    width: _tableWidth,
                    render: (text,record) => text || text === 0 ? this._assetStatus(text) : '--'
                },
            ],
            columns1: [
                {
                    title: '序号',
                    align: columnsAlign,
                    dataIndex: 'no',
                    width: _tableWidth,
                    render:(text,record,index)=>this.noShow(index)
                },
                {
                    title: '标的物名称',
                    align: columnsAlign,
                    dataIndex: 'subjectMatterName',
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
                    title: '预约情况（人数）',
                    align: columnsAlign,
                    dataIndex: 'id',
                    width: _tableWidth,
                    render: (text,record) => <span className="green_color" onClick={this.viewAnswer.bind(this,text,record)}>查看详情 ({record.reserveNumber ?record.reserveNumber : 0})</span>
                },
            ],
            columns:[
                {
                    title: '序号',
                    align: columnsAlign,
                    dataIndex: 'no',
                    width: _tableWidth,
                    render:(text,record,index)=>`${index+1}`
                },
                {
                    title: '标的物名称',
                    align: columnsAlign,
                    dataIndex: 'subjectMatterName',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '标的物编号',
                    align: columnsAlign,
                    dataIndex: 'numbers',
                    width: _tableWidth,
                    render: (text) => text ? <span className="green_color" onClick={this.jumpAssetQuery.bind(this,text)}>{text}</span> : '--'
                },
                {
                    title: '预约人姓名',
                    align: columnsAlign,
                    dataIndex: 'name',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '电话',
                    align: columnsAlign,
                    dataIndex: 'mobile',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '预约看样时间',
                    align: columnsAlign,
                    dataIndex: 'seeingTime',
                    width: 200,
                    render: (text) => text ? this.seeingTimeDo(text) : '--'
                },
                {
                    title: '状态',
                    align: columnsAlign,
                    dataIndex: 'status',
                    width: 80,
                    render: (text,record) => text || text === 0 ? this._assetStatus(text) : '--'
                },
                {
                    title: '操作',
                    align: columnsAlign,
                    dataIndex: 'id',
                    width: 150,
                    render: (text,record) => <span className="green_color" onClick={this.answerEdit.bind(this,text)}>标记为已知晓</span>
                },
            ],
        }
    }

    componentDidMount() { //预加载数据
        this.handleSearch();
        this.waitListGet();
    }

    noShow = (index) => {
        let pageNumber = ((this.state.pageInfo['pageNumber']-1) * this.state.pageInfo['pageSize']) + (index+1)
        return pageNumber
    }

    _assetStatus = (text) => {
        let showText = '';
        if (text === 0) {
            showText = '未签到'
        } else if (text === 1) {
            showText = '已签到'
        }
        return showText
    }

    seeingTimeDo = (text) => {
        let json = JSON.parse(text);
        return json.map((item,index)=>
            <span>{item.seeingTime ? item.seeingTime : '--'} 至 {item.endTime ? item.endTime : '--'}</span>
        )
    }

    jumpAssetQuery = async (text) => { //请求数据函数
        this.setState({
            loading: true
        })
        try {
            const result = await HTTP.getIdByNumbers({
                numbers: text
            });
            this.setState({
                loading: false
            })
            if (result.success) {
                sessionStorage.setItem('assetBaseId',result.data)
                sessionStorage.setItem('status',result.data3)
                sessionStorage.removeItem('isRelease')
                sessionStorage.setItem('pageName','asset_query_detail')
                let href = '';
                switch(result.data4) {
                    case '0': href = `/project/asset_query/asset_detail/house_property/${result.data2 ? result.data2 : null}`;break;
                    case '3': href = `/project/asset_query/asset_detail/other/${result.data2 ? result.data2 : null}`;break;
                    case '1': href = `/project/asset_query/asset_detail/vehicle/${result.data2 ? result.data2 : null}`;break;
                    case '2': href = `/project/asset_query/asset_detail/land/${result.data2 ? result.data2 : null}`;break;
                    default: href = '';return;
                }
                sessionStorage.setItem('pageTitle','标的详情');
                window.open(window.location.href.split('#')[0] + '#' + href);
                // this.props.history.push(href)
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false
            })
        }
    }

    pageJump = (e) => { //分页跳转
        console.log(e)
        this.setState({
            loading1: true,
            tableListDataSource1: [],
            pageInfo: {pageNumber: e.current, pageSize: e.pageSize},
            pagination: {...this.state.pagination, current: e.current}
        }, function () {
            this.loadlists({...this.state.pageInfo, ...this.state.searchInfo})
        })
    }
    handleSearch = () => { //查询请求
        this.setState({
            loading1: true
        })
        this.setState({
            tableListDataSource1: [],
            searchInfo: {...this.state.searchInfo,bidName: this.state.questionValue},
            pagination: {total: 1, pageSize: 10, current: 1},
            pageInfo: {pageNumber: '1', pageSize: '10'},
        }, function () {
            this.loadlists({...this.state.pageInfo, ...this.state.searchInfo})
        })
    }

    waitListGet = async () => { //请求数据函数
        try {
            const result = await HTTP.bookUnreadList({});
            console.log('result', result);
            this.setState({
                loading: false
            })
            if (result.success) {
                this.setState({
                    tableListDataSource: result.data,
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

    loadlists = async (data) => { //请求数据函数
        console.log(data)
        try {
            const result = await HTTP.bidListGet2({
                ...data
            });
            console.log('result', result);
            this.setState({
                loading1: false
            })
            if (result.success) {
                this.setState({
                    tableListDataSource1: result.data.list,
                    pagination: {...this.state.pagination, total: result.data.total},
                })
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading1: false
            })
            // message.error(e.message);
        }
    }

    answerEdit = (id,answer) => { //编辑
        this.setState({
            answerVisible: true,
            questionId: id
        });
    }

    answerHandleCancel = (e) => {
        console.log(e);
        this.setState({
            answerVisible: false,
        });
    }

    viewAnswer = async (id,record) => { //请求数据函数
        let seeingTime = record.seeingTime ? this.seeingTimeDo(record.seeingTime): '--';
        this.setState({
            loading2: true,
            questionVisible: true,
            bidName: record.subjectMatterName ? record.subjectMatterName : '--',
            bidNumbers: record.numbers ?record.numbers : '--',
            seeingTime: seeingTime
        })
        try {
            const result = await HTTP.bookAssetBookList({
                assetId: id
            });
            console.log('result', result);
            this.setState({
                loading2: false,
            })
            if (result.success) {
                this.setState({
                    tableListDataSource2: result.data,
                })
              
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading2: false
            })
        }
    }

    questionHandleCancel = (e) => {
        console.log(e);
        this.setState({
            questionVisible: false,
        });
    }

    questionOnChange = (e) => {
        console.log(e.target.value);
        this.setState({
            questionValue: e.target.value,
        });
    }

     /**
     * @desc 添加防抖，防止连击
     * */
    saveAnswerHandle = LodashDebounce((e) => this._AnswerHandle(e,0));
    
    _AnswerHandle = async (e) => { 
        this.setState({
            loading: true,
        })
        try {
            const result = await HTTP.bookSetRead({
                id: this.state.questionId,
            });
            this.setState({
                loading: false,
            })
            console.log('result', result);
            if (result.success) {
                message.success('操作成功！');
                this.setState({
                    loading: true,
                    questionValue: '',
                },function(){
                    this.answerHandleCancel();
                    this.waitListGet();
                    this.handleSearch();
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

    questionStatus = (status) => {
        let text = '';
        switch (status) {
            case 0: text= <span className="orange_border">待解答</span>;break;
            case 1: text= <span className="green_border">已解答</span>;break;
            case 2: text= <span className="gray_border">不予解答</span>;break;
            default: text = null;
        }
        return text;
    }
    
    render() {
        return (
            <div className="table-list">
                <Card bordered={false}>
                        
                        <DetailModuleBox title="待处理">
                        <Table bordered rowKey="id" columns={this.state.columns}
                                dataSource={this.state.tableListDataSource} loading={this.state.loading} pagination={false}/>
                        </DetailModuleBox>
                        <Modal
                            title=""
                            visible={this.state.answerVisible}
                            onCancel={this.answerHandleCancel}
                            footer={[
                                <Button  type="primary" className="orange_btn" onClick={this.saveAnswerHandle}>确定</Button>,
                                <Button onClick={this.answerHandleCancel}>关闭</Button>,
                              ]}
                            >
                                <p className="text_center">是否标记为已知晓</p>
                        </Modal>
                        <DetailModuleBox title="预约情况列表">
                            <div className="question_sear_box">
                                <span>标的物名称/编号：</span>
                                <Input value={this.state.questionValue} onChange={this.questionOnChange} className="question_sear"/>
                                <Button htmlType="submit" type="primary" onClick={this.handleSearch}>搜索</Button>
                            </div>
                            <Table bordered rowKey="id" columns={this.state.columns1}
                                    dataSource={this.state.tableListDataSource1} loading={this.state.loading1}
                                    onChange={this.pageJump} pagination={this.state.pagination}/>
                        </DetailModuleBox>
                        <Modal
                            title={''}
                            visible={this.state.questionVisible}
                            onCancel={this.questionHandleCancel}
                            footer={null}
                            width="50%"
                            >
                            <Descriptions title="" bordered style={{marginBottom: 10}}>
                                <Descriptions.Item span={2} label="标的物名称">{this.state.bidName}</Descriptions.Item>
                                <Descriptions.Item span={2} label="标的物编号">{this.state.bidNumbers}</Descriptions.Item>
                                <Descriptions.Item span={2} label="预约看样时间">{this.state.seeingTime}</Descriptions.Item>
                            </Descriptions>
                            <Table bordered rowKey="id" columns={this.state.columns2}
                                dataSource={this.state.tableListDataSource2} loading={this.state.loading2} pagination={false}/>
                        </Modal>
                </Card>
            </div>
        )
    }
}

export default BookCount
