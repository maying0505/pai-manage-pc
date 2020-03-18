import React from 'react';
import { Input, Spin, Card, Form, Button, message, Modal} from 'antd';
import * as HTTP from 'units/Axios';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import './index.less';


class GenUrlForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            genUrl: '',
            visible: false,
            title: ''
        }
    }

    componentDidMount() { //预加载数据
       this.setState({
            loading: false
       })
    }

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
                message.warning('请填写标的物编号！');
                return
            }
            this._genUrlGet(values);
        });
    }

    _genUrlGet = async (values) => { //请求数据函数
        console.log(values)
        try {
            const result = await HTTP.genUrlGet({
                ...values
            });
            console.log('result', result);
            this.setState({
                loading: false
            })
            if (result.success) {
                this.setState({
                    genUrl: result.data,
                    title: values.number + '小程序链接'
                },function(){
                    this.showModal();
                })
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false
            })
        }
    }
    
    showModal = () => {
        this.setState({
          visible: true,
        });
    }
    
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    onCopy = () => {
        message.success('复制成功');
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const { genUrl, loading, title } = this.state;
        return (
            <div className="container">
                <Spin size="large" spinning={loading} style={{minHeight: '200px'}}>
                    <Card title="小程序链接生成" bordered={false}>
                        <Form onSubmit={this.handleSubmit}>
                            <span>标的物编号：</span>
                            {getFieldDecorator('number', {
                                rules: [{ required: true, message: '必填!' }],
                            })(
                                <Input placeholder="请输入标的物编号" style={{width: '250px'}}/>
                            )}
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                    确定
                            </Button>
                        </Form>
                        <Modal
                            title={title}
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            bodyStyle={{height: '100px',textAlign: 'center'}}
                            footer={[
                                    <CopyToClipboard text={genUrl}
                                    onCopy={() => this.onCopy()}>
                                        <Button type="primary">复制</Button>
                                    </CopyToClipboard>
                                ,
                                <Button key="back" onClick={this.handleCancel}>关闭</Button>,
                              ]}
                        >
                            <span>{genUrl}</span>
                        </Modal>
                    </Card>
                </Spin>
            </div>
        )
    }
}
const GenUrl = Form.create()(GenUrlForm)

export default GenUrl
