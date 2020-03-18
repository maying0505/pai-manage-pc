import React from 'react';
import PropTypes from 'prop-types';
import { Table, Spin, Select, Row, Col, Form, Button, Modal, message } from 'antd';
import * as HTTP from 'units/Axios';
import PicturesWall from 'components/ImgUpload';

const FormItem = Form.Item;
const Option = Select.Option;
const columnsAlign ='center';

class StateChangeForm extends React.Component {
    static propTypes = {
        stateChangeVisible: PropTypes.bool,
        stateChangeId: PropTypes.string,
        stateChangeHandleCancel: PropTypes.func,
        numbers: PropTypes.string,
    };

    static defaultProps = {
        numbers: '',
        stateChangeHandleCancel: ()=>{},
        stateChangeVisible: false,
        stateChangeId: '',
    };

    constructor(props) {
        super(props)
        this.state = {
            oldStatus: '',//当前状态
            statusArr: [
                {
                    status: 13,
                    name: "拍卖结束",
                },
                {
                    status: 14,
                    name: "流拍",
                },
                {
                    status: 15,
                    name: "中止",
                },
                {
                    status: 16,
                    name: "撤回",
                },
                {
                    status: 1,
                    name: "第二次拍卖",
                },
                {
                    status: 2,
                    name: "变卖",
                },
                {
                    status: 18,
                    name: "暂缓",
                },
            ],
            columns:[
                {
                    title: '标的编号',
                    align: columnsAlign,
                    dataIndex: 'numbers',
                    render: (text) => text ? text : '--'
                },
                {
                    title: '更改前状态',
                    align: columnsAlign,
                    dataIndex: 'oldStatus',
                    render: (text) => text || text === 0 ? this.statusShow(text) : '--'
                },
                {
                    title: '更改后状态',
                    align: columnsAlign,
                    dataIndex: 'status',
                    render: (text) => text || text === 0 ? this.statusShow(text) : '--'
                },
                {
                    title: '备注',
                    align: columnsAlign,
                    dataIndex: 'remarks',
                    render: (text) => text ? text : '--'
                },
                {
                    title: '操作员',
                    align: columnsAlign,
                    dataIndex: 'sysUser.name',
                    render: (text) => text ? text : '--'
                },
                {
                    title: '时间',
                    align: columnsAlign,
                    dataIndex: 'createTime',
                    render: (text) => text ? text : '--'
                },
            ],
            stateChangeId:'',
            assetId: '',
            loading: true,
            imgSavaData: [],
            isSave: true,
            tableListDataSource: [],
            tableLoading: true,
            numbers: '',
            imgDefaultData: [],
        }
    }
    
    componentWillMount(){ //预加载数据
        this.propsGet(this.props);
    }
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        this.propsGet(nextProps);
    }

    propsGet = (props) => {
        if(props.stateChangeId !== this.state.stateChangeId){
            this.setState({
                stateChangeId: props.stateChangeId,
                numbers: props.numbers,
            },function(){
                this._getStatus()
                this._getStatusRecord()
            })
        }
    }
    _getStatusRecord = async () => { //状态更改记录
        try {
            const result = await HTTP.getstatusByAssetId({
                assetBaseId: this.state.stateChangeId,
            });
            this.setState({
                tableLoading: false
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
                tableLoading: false
            })
            // message.error(e.message);
        }
    };
    _getStatus = async () => { //获取状态
        try {
            const result = await HTTP.getstatus({
                assetBaseId: this.state.stateChangeId,
            });
            this.setState({
                loading: false
            })
            console.log('getstatus', result);
            if (result.success) {
                this.setState({
                    oldStatus: result.data.status,
                    assetId: result.data.number,
                })
                this.imgDataDo(result.data.images ? result.data.images : []);
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false
            })
            // message.error(e.message);
        }
    };
    imgDataDo = (data) => {
        let imgDefaultDataBoxs = [];
        for (let item of data) {
            let imgDefaultDataBox = {};
            imgDefaultDataBox['bigUrl'] = item['waterMarkImage'] ? item['waterMarkImage']: ''
            imgDefaultDataBox['url'] = item['pathThumb2FileName'] ? item['pathThumb2FileName']: ''
            imgDefaultDataBox['uid'] = `images${Math.random()}`
            imgDefaultDataBox['status'] = 'done'
            imgDefaultDataBox['fileName'] = item['fileName'] ? item['fileName']: ''
            imgDefaultDataBoxs.push(imgDefaultDataBox)
        }
        this.setState({
            imgDefaultData: [...this.state.imgDefaultData,...imgDefaultDataBoxs],
        })
        
    }
    _stateChangeHandleOk = (e) => { //状态更改保存提交
        e.preventDefault();
        if (!this.state.isSave){
            message.warning('请在所有文件上传完成后提交或保存!')
            return
        }
        this.props.form.validateFields((err, values) => {
            if (err){   
                return;
            }
            this.setState({
                loading: true
            })
            if (values.status === 1 || values.status === 2) {
                values.stage = values.status;
                values.status = '';
            }
             
            this._stateChangeSave(values);
        })
    };
    _stateChangeSave = async (param) => { //状态更改保存提交
            try {
                const result = await HTTP.changestatus({
                    assetBaseId: this.state.stateChangeId,
                    oldStatus: this.state.oldStatus,
                    ...param
                });
                this.setState({
                    loading: false
                })
                console.log('result', result);
                if (result.success) {
                    this.props.stateChangeHandleCancel(true)
                    message.success(result.message);
                } else {
                    message.error(result.message);
                }
            } catch (e) {
                this.setState({
                    loading: false
                })
                // message.error(e.message);
            }
    };

    _stateChangeHandleCancel = (e) => {
        console.log(e);
        this.props.stateChangeHandleCancel()
    }
    onPicturesWallChange = (event,index,style,status) =>{ //处理图片上传数据
        this.setState({
            isSave: false
        })
        console.log('status',status)
        if (status === 'uploading') return
        let imgSaveBox = []
        let isSaveBefore = true
        let imgSavaDataB = this.state.imgSavaData

        console.log(JSON.stringify(event))
        for (let i in event) {
            // if (event[i].response) {
            //     event[i].response.success ? imgSaveBox.push(event[i].response.data): null
            //     if (i == (event.length-1)) {
            //         event[i].response.success ? null : message.error(event[i].response.message?event[i].response.message:'上传失败')
            //     }
            // }
            // for (let item of imgSavaDataB) {
            //     if (item['pathThumb2FileName'] === event[i].url){
            //         imgSaveBox.push(item)
            //     }
            // }
            if (event[i].status !== 'done' && event[i].status) {
                isSaveBefore = false
            }
        }
        // imgSaveBox = JSON.stringify(imgSaveBox)
        console.log(event)
        console.log(imgSaveBox)
        this.setState({
            imgSavaData: imgSaveBox,
            isSave: isSaveBefore
        },function(){
            console.log(this.state.imgSavaData)
        })

    }
    statusShow = (status) => {
        let text = '';
        let allStatus = [];
        if (sessionStorage.getItem('assetStatusList')) {
            allStatus = JSON.parse(sessionStorage.getItem('assetStatusList'));
        }
        for (let item of allStatus){
            if (item.status === status) {
                text = item.name;
            }
        }
        return text

    }
    render() {
        const { imgDefaultData, tableLoading, tableListDataSource, columns, statusArr, oldStatus, assetId, loading } = this.state;
        console.log('statusArr',statusArr)
        return (
            <Modal
                title="状态更改"
                visible={this.props.stateChangeVisible}
                onCancel={this._stateChangeHandleCancel}
                footer={null}
                width= '40%'
                destroyOnClose={true}
                >
                <Spin size="large" spinning={loading}>
                    <Form onSubmit={this._stateChangeHandleOk} className="ant-search-form status_form">
                        <Row>
                            <Col md={24} sm={24}>
                                <FormItem className="small-input">
                                    <span className="width_2">标的编号：</span>
                                    <span className="width_7">{assetId}</span>
                                </FormItem>
                            </Col>
                            <Col md={24} sm={24}>
                                <FormItem className="small-input">
                                    <span className="width_2">当前状态：</span>
                                    <span className="width_7">{this.statusShow(oldStatus)}</span>
                                </FormItem>
                            </Col>
                            <Col md={24} sm={24}>
                                <FormItem className="small-input">
                                    <span className="width_2">更改后状态：</span>
                                    {this.props.form.getFieldDecorator('status',{
                                    rules: [{required: true, message: '必填项!' }],
                                    })(
                                        <Select allowClear={true} className="width_7" placeholder="请选择">
                                            {statusArr.map((val,index)=>
                                                <Option value={val.status} key={index}>{val.name}</Option>
                                            )}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={24} sm={24}>
                                <FormItem className="small-input">
                                    <span className="width_2 vert_top">备注：</span>
                                    {this.props.form.getFieldDecorator('remarks')(
                                        <textarea className="width_7" style={{marginTop: '13px'}}></textarea>
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={24} sm={24}>
                                <div className="flex">
                                    <span className="upload_label width_2">图片：</span>
                                    <PicturesWall isD={true} businessId={this.state.stateChangeId} businessType={'S01'} componentsStyle={'imageJson'} defaultFileList={imgDefaultData} onPicturesWallChange={this.onPicturesWallChange.bind(this)} />
                                </div>
                            </Col>
                            <Col md={24} sm={24} style={{marginTop: '30px',textAlign:'center'}}>
                                <Button htmlType="submit" onClick={this._stateChangeHandleOk}>提交</Button>
                                <Button type="primary" style={{marginLeft: 8}} onClick={this._stateChangeHandleCancel}>关闭</Button>
                            </Col>
                        </Row>
                    </Form>
                    <div className="blod" style={{marginBottom: '20px'}}>状态更改记录：</div>
                    <Table bordered rowKey="id" columns={columns} pagination={false} dataSource={tableListDataSource} loading={tableLoading} />
                </Spin>
            </Modal>              
        );
    }
}
const StateChange = Form.create()(StateChangeForm)
export default StateChange