import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, InputNumber, Button, Modal, message } from 'antd';
import * as HTTP from 'units/Axios';

const FormItem = Form.Item;

class TransactionPriceForm extends React.Component {
    static propTypes = {
        transactionPriceVisible: PropTypes.bool,
        transactionPriceId: PropTypes.string,
        transactionPriceHandleCancel: PropTypes.func,
        
    };

    static defaultProps = {
        transactionPriceHandleCancel: ()=>{},
        transactionPriceVisible: false,
        transactionPriceId: '',
    };

    constructor(props) {
        super(props)
        this.state = {
            
        }
    }
    
    _transactionPriceSave = async (values) => { //成交价保存提交
            try {
                const result = await HTTP.setFinalPrice({
                    finalPrice: values.finalPrice ? values.finalPrice : '',
                    assetBaseId: this.props.transactionPriceId
                });
                
                console.log('result', result);
                if (result.success) {
                    this.props.transactionPriceHandleCancel(true)
                    message.success(result.message);
                } else {
                    message.error(result.message);
                }
            } catch (e) {
                // message.error(e.message);
            }
    };
    _transactionPriceHandleOk = (e) => { //成交价保存提交
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            this._transactionPriceSave(values);
        })
    };

    _transactionPriceHandleCancel = (e) => {
        console.log(e);
        this.props.transactionPriceHandleCancel()
    }
    render() {
        return (
            <Modal
                title="成交价"
                visible={this.props.transactionPriceVisible}
                onCancel={this._transactionPriceHandleCancel}
                footer={null}
                destroyOnClose={true}
                >
                <Form onSubmit={this._transactionPriceHandleOk} layout="inline" className="ant-search-form text_center">
                    <Row>
                        <Col md={24} sm={24}>
                            <FormItem className="small-input">
                                {this.props.form.getFieldDecorator('finalPrice',{initialValue: undefined})(
                                    <InputNumber />
                                )}
                            </FormItem>
                        </Col>
                        <Col md={24} sm={24}>
                            <Button htmlType="submit" onClick={this._transactionPriceHandleOk}>提交</Button>
                            <Button type="primary" style={{marginLeft: 8}} onClick={this._transactionPriceHandleCancel}>关闭</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>              
        );
    }
}
const TransactionPrice = Form.create()(TransactionPriceForm)
export default TransactionPrice