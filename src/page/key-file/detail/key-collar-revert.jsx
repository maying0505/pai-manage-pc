import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Button, message, Spin, Modal, Row, Col, DatePicker } from 'antd';
import DetailModuleBox from 'common/DetailModuleBox';
import LodashDebounce from 'common/debounce';
import * as HTTP from 'units/Axios';
import 'components/AssetDetail/index.less';
import zh_CN from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
import './index.less'

class KeyCollarRevertForm extends React.Component {
    static propTypes = {
        visible: PropTypes.bool,
        keyCollarRevertCancel: PropTypes.func,
        historyId: PropTypes.string,
    };

    static defaultProps = {
        historyId: '',
        visible: false,
        keyCollarRevertCancel: ()=>{},
    };
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            revertDetail: {},
            assetBaseId: '',
            isShow: false,
        }
    }

    componentDidMount() { //预加载数据
        
    }
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        
    }
    
    /**
     * @desc 添加防抖，防止连击
     * */
    _onSubmit = LodashDebounce((e) => this.handleSave(e));

    handleSave = (e) => {        
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                message.warning('请填完必填项！');
                return;
            }
            console.log('values:', values)
            values.returnData = values.returnData ? values.returnData.format('YYYY-MM-DD') : undefined; 
            this.setState({
                loading: true,
            })
          
            this._save(values)
            
        })
    }
   
    _save = async (data) => { 
        console.log(data)
        try {
            const result = await HTTP.keyCollarReturnSave({
                ...data,
                historyId: this.props.historyId
            });
            console.log('result', result);
            this.setState({
                loading: false,
            })
            if (result.success) {
                message.success('提交成功！');
                this.handleOk()
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false,
            })
        }
    }
   
    handleOk = (e) => {
        console.log(e);
        this.props.keyCollarRevertCancel(true)
    }

    handleCancel = (e) => {
        console.log(e);
        this.props.keyCollarRevertCancel()
    }

    render() {
        const { isShow, loading } = this.state;
        const { form, visible } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                title="钥匙归还"
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                destroyOnClose={true}
                footer={null}
                width="70%"
                >
                <Spin size="large" spinning={loading}>               
                    <Form layout="inline" className={isShow  ? 'detail_box' : ''}> 
                        <DetailModuleBox title="钥匙归还" id="essential-information" className={isShow? 'detail_box' : ''}>
                            <Row>
                                <Col xl={8} lg={12} className="text_center" style={{marginBottom: '15px'}}>
                                    <span>归还日期：</span>
                                    <span className="show_input text_left" style={{border: 'none',padding: '0'}}>
                                        {getFieldDecorator('returnData')(
                                            <DatePicker locale={zh_CN} style={{width: '100%'}}/>
                                        )}
                                    </span>
                                </Col>
                                <Col span={24} style={{marginBottom: '15px'}}>
                                    <span className="key_detail_label key_detail_label_1">备注：</span>
                                    <span className="show_input key_detail_input text_left">
                                        {getFieldDecorator('returnRemake')(
                                            <textarea style={{width: '100%'}}/>
                                        )}
                                    </span>
                                </Col>
                            </Row>
                            <div className="text_center form_submit_box">
                                {
                                    !isShow && <Button type="primary" style={{marginLeft: 8}} onClick={this._onSubmit}>提交</Button>
                                }
                                <Button style={{marginLeft: 8}} onClick={this.handleCancel}>关闭</Button>
                            </div>
                        </DetailModuleBox>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

const KeyCollarRevert = Form.create()(KeyCollarRevertForm)
export default KeyCollarRevert
