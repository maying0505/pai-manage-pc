import React, { Component } from 'react';
import 'style/login.less';
import loginLogo from 'style/img/login_log.png';
import * as HTTP from 'units/Axios';
import { inject, observer } from 'mobx-react';
import { Form, Icon, Input, Button, Checkbox, message, Spin } from 'antd';
import upgradeImg from 'style/img/upgrade.jpg';
const FormItem = Form.Item;

const login = [{
    username:'admin',
    password:'admin'
},{
    username:'zysoft',
    password:'zysoft'
}];


function PatchUser(values) {  //匹配用户
    const results = login.map(function(item){
        if(values.username === item.username && values.password === item.password){
            return 1;
        }else{
            return 0;
        }
    });
    return results.includes(1);
};

@inject('login') // 给组件注入其需要的 store，指定对应的子 store 名称
@observer // 将组件转化为响应式组件
class NormalLoginForm extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        isLoding: false,
        loading: true,
        ifUpgrade: true
    };

    componentWillMount() {
        this._isupgrade();
        sessionStorage.clear();
        // const { changeLoginState } = this.props.login;
        // changeLoginState(true); 
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this._loginFetch(values)
                // if(PatchUser(values)){
                //     this.setState({
                //         isLoding: true,
                //     });
                    
                //     localStorage.setItem('mspa_user',JSON.stringify(values));
                //     message.success('登录成功!'); //成功信息
                //     let that = this;
                //     setTimeout(function() { //延迟进入
                //         that.props.history.push({pathname:'/app',state:values});
                //     }, 2000);

                // }else{
                //     message.error('login failed!'); //失败信息
                // }
                
            }
        });
    };
    
    _isupgrade = async () => {
        this.setState({
            loading: true,
        });
        try {
            const result = await HTTP.isupgrade({});
            console.log('result', result);
            this.setState({
                loading: false,
            });
            if (result.success) {
                this.setState({
                    ifUpgrade: result.data
                })
            } else {
                message.error(result.message);
            }
        } catch (e) {
            this.setState({
                loading: false,
            });
            // message.error('登录失败!');
        }
    };

    _loginFetch = async (params) => {
        this.setState({
            loading: true,
        });
        try {
            const result = await HTTP.login({
                type: 2,
                ...params
            });
            console.log('result', result);
            this.setState({
                loading: false,
            });
            if (result.success) {
                sessionStorage.setItem('sidebarArr',JSON.stringify(result.data.menuList))
                sessionStorage.setItem('headPortrait',result.data.photo)
                
                sessionStorage.setItem('token_y',result.data2);
                sessionStorage.setItem('mspa_user',JSON.stringify(params));
                message.success('登录成功!'); //成功信息
                sessionStorage.setItem('pageTitle',result.data.menuList[0]?result.data.menuList[0].name:'')
                this.props.history.push({pathname:result.data.menuList[0]?'/project/'+result.data.menuList[0].href:'/project',state:params});
            } else {
                message.error('登录失败!');
            }
        } catch (e) {
            this.setState({
                loading: false,
            });
            // message.error('登录失败!');
        }
    };


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            this.state.isLoding?<Spin size="large" spinning={this.state.loading} />:
            <div className="login">
                {this.state.ifUpgrade ? <div className="login-form">
                    <div className="login-logo">
                        <div className="text_center login-logo-img"><img src={loginLogo}/></div>
                        <div className="login-name">登录</div>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:'0'}}>
                            {/* {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )} */}
                            {/* <a className="login-form-forgot" href="" style={{float:'right'}}>忘记密码?</a> */}
                            <Button type="primary" loading={this.state.loading} htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                            {/* Or <a href="">现在就去注册!</a> */}
                        </FormItem>
                    </Form>
                    {/* <a className="githubUrl" href="https://github.com/zhaoyu69/antd-spa"> </a> */}
                </div>: <img src={upgradeImg} className="upgrade_img"/>}
            </div>
        );
    }
}

const Login = Form.create()(NormalLoginForm);
export default Login;