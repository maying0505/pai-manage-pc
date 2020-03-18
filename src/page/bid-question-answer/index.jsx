import React from 'react';
import { Table, Card, Button, message, Modal, Input } from 'antd';
import * as HTTP from 'units/Axios';
import DetailModuleBox from 'common/DetailModuleBox';
import LodashDebounce from 'common/debounce';
import wenImg from 'style/img/wen.png';
import daImg from 'style/img/da.png';
import './index.less';
// const _tableWidth = 100/15+'%';
const _tableWidth = '';
const columnsAlign = 'center';
const { TextArea } = Input;

class BidQuestionAnswer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            questionValue: '',
            questionAnswers: [],
            questionModalTitle: '',
            answerVisible: false,
            questionVisible: false,
            questionId: '',
            answerValue: '',
            loading: true,
            loading1: false,
            tableListDataSource: [],
            tableListDataSource1: [],
            pageInfo: {pageNumber: '1', pageSize: '10'},
            searchInfo: {},
            pagination: {total: 1, pageSize: 10, current: 1},
            columns1: [
                {
                    title: '序号',
                    align: columnsAlign,
                    dataIndex: 'no',
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
                    title: '标的物编号',
                    align: columnsAlign,
                    dataIndex: 'numbers',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '问题数量',
                    align: columnsAlign,
                    dataIndex: 'id',
                    width: _tableWidth,
                    render: (text,record) => <span className="green_color" onClick={this.viewAnswer.bind(this,record.questionAnswers,record.subjectMatterName,record.numbers)}>查看全部 ({record.count ?record.count : 0})</span>
                },
            ],
            columns:[
                {
                    title: '序号',
                    align: columnsAlign,
                    dataIndex: 'number',
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
                    title: '标的物编号',
                    align: columnsAlign,
                    dataIndex: 'numbers',
                    width: _tableWidth,
                    render: (text) => text ? <span className="green_color" onClick={this.jumpAssetQuery.bind(this,text)}>{text}</span> : '--'
                },
                {
                    title: '问题',
                    align: columnsAlign,
                    dataIndex: 'question',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '问题提交时间',
                    align: columnsAlign,
                    dataIndex: 'creatTime',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '答案',
                    align: columnsAlign,
                    dataIndex: 'id',
                    width: _tableWidth,
                    render: (text,record) => <Button size="small" onClick={this.answerEdit.bind(this,text,record.answer)}>编辑</Button>
                },
            ],
        }
    }

    componentDidMount() { //预加载数据
        this.handleSearch();
        this.waitListGet();
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
            searchInfo: {...this.state.searchInfo,key: this.state.questionValue},
            pagination: {total: 1, pageSize: 10, current: 1},
            pageInfo: {pageNumber: '1', pageSize: '10'},
        }, function () {
            this.loadlists({...this.state.pageInfo, ...this.state.searchInfo})
        })
    }

    waitListGet = async () => { //请求数据函数
        try {
            const result = await HTTP.waitList({});
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
            const result = await HTTP.quesList({
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
            answerValue: answer,
            questionId: id
        });
    }

    answerHandleCancel = (e) => {
        console.log(e);
        this.setState({
            answerVisible: false,
        });
    }

    answerOnChange = (e) => {
        console.log(e.target.value);
        this.setState({
            answerValue: e.target.value,
        });
    }

    viewAnswer = (e,subjectMatterName,numbers) => {
        this.setState({
            questionAnswers: e,
            questionVisible: true,
            questionModalTitle: <span className="answer_title"><span className="answer_title_tip"></span>标的物名称：{subjectMatterName}<span style={{marginLeft: '15px'}}>标的物编号：{numbers}</span></span>
        })
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
    submitAnswerHandle = LodashDebounce((e) => this._AnswerHandle(e,1));
    noAnswerHandle = LodashDebounce((e) => this._AnswerHandle(e,2));
    
    _AnswerHandle = async (e,status) => { 
        this.setState({
            loading: true,
        })
        try {
            const result = await HTTP.saveAnswer({
                questionId: this.state.questionId,
                answer: this.state.answerValue,
                status: status
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
                    answerValue: ''
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
                        
                        <DetailModuleBox title="待解答">
                        <Table bordered rowKey="id" columns={this.state.columns}
                                dataSource={this.state.tableListDataSource} loading={this.state.loading} pagination={false}/>
                        </DetailModuleBox>
                        <Modal
                            title="答案"
                            visible={this.state.answerVisible}
                            onCancel={this.answerHandleCancel}
                            footer={[
                                <Button  type="primary" className="orange_btn" onClick={this.saveAnswerHandle}>保存</Button>,
                                <Button onClick={this.noAnswerHandle}>不处理</Button>,
                                <Button type="primary" onClick={this.submitAnswerHandle}>提交</Button>
                              ]}
                            >
                            <TextArea placeholder="请您输入答案" value={this.state.answerValue} onChange={this.answerOnChange} autosize={{ minRows: 5 }} />
                        </Modal>
                        <DetailModuleBox title="标的问答列表">
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
                            title={this.state.questionModalTitle}
                            visible={this.state.questionVisible}
                            onCancel={this.questionHandleCancel}
                            footer={null}
                            width="50%"
                            >
                            {
                                this.state.questionAnswers.map((item,index)=>
                                <div className="question_box">
                                    <div>
                                        <img src={wenImg} className="wen_da_img"/>
                                        <span>{item.question}？</span>
                                        {this.questionStatus(item.status)}
                                    </div>
                                    <div className="flex">
                                        <img src={daImg} className="wen_da_img"/>
                                        <span className="da_text">{item.answer ? item.answer : '--'}</span>
                                    </div>
                                </div>
                            )
                            }
                        </Modal>
                </Card>
            </div>
        )
    }
}

export default BidQuestionAnswer
