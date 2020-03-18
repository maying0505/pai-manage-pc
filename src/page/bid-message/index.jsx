import React from 'react';
import { Spin, message} from 'antd';
import * as HTTP from 'units/Axios';
import messageIcon from 'style/img/tongzhi.png';
import './index.less';

class BidMessage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            messageList: []
        }
    }

    componentDidMount() { //预加载数据
        this.loadlists() 
    }

   
    loadlists = async (data) => { //请求数据函数
        console.log(data)
        try {
            const result = await HTTP.supervisorMessageList({});
            console.log('result', result);
            this.setState({
                loading: false
            })
            
            if (result.success) {
                this.setState({
                    messageList: result.data,
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

    messageShow = (data) => {
        data = JSON.parse(data)
        let text = [];
        for(let p in data){//遍历json对象的每个key/value对,p为key
            text.push(<div className="gray_color" key={p}>{p}：{data[p]}</div>) 
        }
        return text;
    }

    render() {
        const { messageList, loading } = this.state;
        
        return (
            <Spin spinning={loading}>
                <div className="message_box">
                    {messageList.map((item,index)=>
                        <div className="message_module flex" key={index}>
                            <img src={messageIcon} className="message_icon"/>
                            <div className="message_content flex-1">
                                <div className="message_title">{item.title ?item.title : '--'}</div>
                                <div className="margin_b10 gray_color">{item.createTime ? item.createTime :'--'}</div>
                                {item.data && this.messageShow(item.data)}
                            </div>
                        </div>
                    )}
                </div>
            </Spin>
        )
    }
}

export default BidMessage
