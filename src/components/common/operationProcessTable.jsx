import React from 'react';
import PropTypes from 'prop-types';
import { Table, message } from 'antd';
import * as HTTP from 'units/Axios';

const _tableWidth = '20%';

class OperationProcessTable extends React.Component {
    static propTypes = {
        assetBaseId: PropTypes.string,
    };

    static defaultProps = {
        assetBaseId: '',
    };

    constructor(props) {
        super(props)
        this.state = {
            Tableloading: true,
            assetBaseId: '',
            operationProcessList: [],
            columns:[
                {
                    title: '步骤',
                    dataIndex: 'stepName',
                    width: _tableWidth,
                    render: (text) => text? text : '--'
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '时间节点',
                    dataIndex: 'creatTime',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '操作员',
                    dataIndex: 'userName',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '审核意见',
                    dataIndex: 'opinion',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                }
            ],
        }
    }
    
    componentWillMount(){ //预加载数据
        this.propsGet(this.props);
        
    }
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        this.propsGet(nextProps);
    }

    propsGet = (props) => {
        if (props.assetBaseId !== this.state.assetBaseId) {
            this.setState({
                assetBaseId: props.assetBaseId
            },function(){
                this._operationProcessGet(props.assetBaseId)
            })
        }
    }
    _operationProcessGet = async (id) => { //请求数据函数
        console.log(id)
        try {
            const result = await HTTP.operationProcess({
                assetBaseId: id,
            });
            console.log('operationProcess', result);
            this.setState({
                Tableloading: false,
            })
            if (result.success) {
                this.setState({
                    operationProcessList: result.data
                })
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                Tableloading: false,
            })
            // message.error(e.message);
        }
    }
    
    render() {
        return (
            <Table rowKey="id" columns={this.state.columns} pagination={false}
            dataSource={this.state.operationProcessList} loading={this.state.tableLoading}/>              
        );
    }
}
export default OperationProcessTable