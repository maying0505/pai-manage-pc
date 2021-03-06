import React from 'react';
import { Spin, Form, Button, message} from 'antd';
import * as HTTP from 'units/Axios';
import creatWordShowJson from './creat-word-showJson';
import FormSet from 'common/FormSet';
import LodashDebounce from 'common/debounce';
import DownloadFile from 'common/download';
import DetailModuleBox from 'common/DetailModuleBox';
import { DateAndTimeTrans } from 'common/NumberFormat';

class CreatWordAuctionForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            auctionInfo: creatWordShowJson.auctionInfo,
        }
    }

    componentDidMount() { //预加载数据
      
    }

      /**
     * @desc 添加防抖，防止连击
     * */
    _handleSubmit = LodashDebounce((e) => this.handleSubmit(e));

    handleSubmit = (e) => { //查询请求
        this.setState({
            loading: true
        })
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                this.setState({
                    loading: false
                })
                return
            }
            values.court = values.court ? values.court[2] : undefined;
            values.auctionTime = values.auctionTime ? values.auctionTime[0].format('YYYY年MM月DD日HH时') + '至' + values.auctionTime[1].format('YYYY年MM月DD日HH时') : undefined;
            let seeingTime = values.seeingTime ? values.seeingTime.format('YYYY年MM月DD日') : undefined;
            let seeingTimeStart = values.seeingTimeStart ? values.seeingTimeStart : 0;
            let seeingTimeEnd = values.seeingTimeEnd ? values.seeingTimeEnd : 0;

            values.seeingTime = seeingTime + seeingTimeStart + '时至' + seeingTimeEnd + '时';
            values.seeingTimeStart = undefined;
            values.seeingTimeEnd = undefined;


            values.payTime = values.payTime ? values.payTime.format('YYYY年MM月DD日') : undefined;
            values.entrustTime = values.entrustTime ? values.entrustTime.format('YYYY年MM月DD日') : undefined;
            values.proveTime = values.proveTime ? values.proveTime.format('YYYY年MM月DD日') : undefined;
            values.downTime = values.downTime ? values.downTime.format('YYYY年MM月DD日') : undefined;
            values.receiptTime = values.receiptTime ? values.receiptTime.format('YYYY年MM月DD日') : undefined;
            
            let trustTime = values.trustTime ? values.trustTime.format('YYYY年MM月DD日') : undefined;
            let noticeTime = values.noticeTime ? values.noticeTime.format('YYYY年MM月DD日') : undefined;
            values.trustTime = trustTime ? DateAndTimeTrans(trustTime) : undefined;
            values.noticeTime = noticeTime ? DateAndTimeTrans(noticeTime) : undefined;
            this._save(values);
        });
    }

    _save = async (values) => { //请求数据函数
        console.log(JSON.stringify(values))
        try {
            const result = await HTTP.auctionWord({
                ...values
            });
            console.log('result', result);
            this.setState({
                loading: false
            })
            if (result.success) {
                if (result.data && result.data.length > 0) {
                    for (let item of result.data) {
                        console.log('DownloadFile',item)
                        DownloadFile(item)
                    }
                }
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false
            })
        }
    }
    
    render() {
        const { loading, auctionInfo } = this.state;
        const { form } = this.props;
        return (
            <div className="container">
                <Spin size="large" spinning={loading} style={{minHeight: '200px'}}>
                    <DetailModuleBox title="拍卖内容填写">
                        <Form layout="inline" id="wy-scroll-layout" style={{marginTop: '0'}}>  
                            <FormSet searchArr={auctionInfo} ColMd={8} ColsM={12} form={form}/>
                            <div className="text_center form_submit_box">
                                <Button type="primary" onClick={this._handleSubmit}>生成</Button>
                            </div>
                        </Form>
                    </DetailModuleBox>
                </Spin>
            </div>
        )
    }
}
const CreatWordAuction = Form.create()(CreatWordAuctionForm)

export default CreatWordAuction
