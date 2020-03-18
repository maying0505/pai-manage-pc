import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, InputNumber, Button, Modal, message } from 'antd';
import * as HTTP from 'units/Axios';
import FormSet from 'common/FormSet';


class SuggestOpinionForm extends React.Component {
    static propTypes = {
        suggestOpinionVisible: PropTypes.bool,
        suggestOpinionId: PropTypes.string,
        superId: PropTypes.string,
        suggestOpinionHandleCancel: PropTypes.func,
        
    };

    static defaultProps = {
        suggestOpinionHandleCancel: ()=>{},
        suggestOpinionVisible: false,
        suggestOpinionId: '',
        superId: '',
    };

    constructor(props) {
        super(props)
        this.state = {
            suggestStatus: sessionStorage.getItem('suggestStatus')?sessionStorage.getItem('suggestStatus'): '--',
            suggestDetail: [
                {
                    isRequired: true,
                    label: '是否达标',
                    child: [
                        {
                            fieldName: 'standard',
                            value: [
                                {
                                    value: 0,
                                    text: '未达标',
                                },
                                {
                                    value: 1,
                                    text: '达标',
                                },
                            ],
                            style: 'select'
                        }
                    ],
                },
                {
                    label: '意见建议',
                    isRequired: true,
                    child: [
                        {
                            fieldName: 'opinion',
                            value: '',
                            style: 'textarea'
                        }
                    ],
                },
            ]
        }
    }
    
    _suggestOpinionSave = async (values) => { //监拍状态提交
            try {
                const result = await HTTP.suggestSubmit({
                    ...values,
                    assetId: this.props.suggestOpinionId,
                    superId: this.props.superId,
                });
                
                console.log('result', result);
                if (result.success) {
                    this.props.suggestOpinionHandleCancel(true)
                    message.success(result.message);
                } else {
                    message.error(result.message);
                }
            } catch (e) {
                // message.error(e.message);
            }
    };
    _suggestOpinionHandleOk = (e) => { //成交价保存提交
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(err){
                return;
            }
            this._suggestOpinionSave(values);
        })
    };

    _suggestOpinionHandleCancel = (e) => {
        console.log(e);
        this.props.suggestOpinionHandleCancel()
    }
    render() {
        return (
            <Modal
                title={`监拍（${this.state.suggestStatus}）状态提交`}
                visible={this.props.suggestOpinionVisible}
                onCancel={this._suggestOpinionHandleCancel}
                footer={null}
                destroyOnClose={true}
                >
                <Form onSubmit={this._suggestOpinionHandleOk} layout="inline" className="ant-search-form text_center">
                    <Row>
                        <Col md={24} sm={24}>
                            <FormSet isShow={false} searchArr={this.state.suggestDetail} ColMd={24} ColsM={24} form={this.props.form}/>
                        </Col>
                        <Col md={24} sm={24}>
                            <Button htmlType="submit" onClick={this._suggestOpinionHandleOk}>提交</Button>
                            <Button type="primary" style={{marginLeft: 8}} onClick={this._suggestOpinionHandleCancel}>关闭</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>              
        );
    }
}
const SuggestOpinion = Form.create()(SuggestOpinionForm)
export default SuggestOpinion