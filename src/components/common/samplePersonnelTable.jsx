import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

const _tableWidth = '20%';

class SamplePersonnelTable extends React.Component {
    static propTypes = {
        SampleCustomerList: PropTypes.array,
    };

    static defaultProps = {
        SampleCustomerList: [],
    };

    constructor(props) {
        super(props)
        this.state = {
            Tableloading: false,
            SampleCustomerList: [],
            columns:[
                {
                    title: '序号',
                    dataIndex: 'numbers',
                    width: _tableWidth,
                    render: (text) => text || text === 0 ? text +1 : '--'
                },
                {
                    title: '姓名',
                    dataIndex: 'name',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '手机号',
                    dataIndex: 'mobile',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    width: _tableWidth,
                    render: (text) => text ? this.statusDo(text) : '--'
                },
                {
                    title: '预约时间',
                    dataIndex: 'createTime',
                    width: _tableWidth,
                    render: (text) => text ? text : '--'
                },
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
        if (props.SampleCustomerList !== this.state.SampleCustomerList) {
            this.setState({
                SampleCustomerList: props.SampleCustomerList
            },function(){

            })
        }
    }
    statusDo = (text) =>{
        if (text === '0') {
            return '未签到'
        } else {
            return '签到'
        }
    }
    render() {
        return (
            <Table rowKey="numbers" columns={this.state.columns} pagination={false} style={{width: '100%'}}
            dataSource={this.state.SampleCustomerList} loading={this.state.tableLoading}/>              
        );
    }
}
export default SamplePersonnelTable