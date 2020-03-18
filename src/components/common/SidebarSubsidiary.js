import React, { Component } from 'react';
import {  Menu, Spin } from 'antd';
import { inject, observer } from 'mobx-react';
import "./style.less";
import history from './history';
import { withRouter } from 'react-router';

@withRouter
@inject('pageTitle') 
@observer 
export default class SidebarSubsidiary extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoding: false,
            urlArr: [
                {
                    "name": "房产",
                    "href": "project/asset_add/asset_detail/1/house_property",
                },
                {
                    "name": "机动车",
                    "href": "project/asset_add/asset_detail/1/vehicle",
                },
                {
                    "name": "土地",
                    "href": "project/asset_add/asset_detail/1/land",
                },
                {
                    "name": "其他",
                    "href": "project/asset_add/asset_detail/1/other",
                },
            ],
            selectedKey: '/project/asset_add/asset_detail/1/house_property', //选择的路径
        }
    }
    componentDidMount() {
        // this._urlFetch();
        console.log('this.props.history',this.props.history)
        this.setMenuOpen(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.setMenuOpen(nextProps);
    }
    setMenuOpen = props => {
        const {path} = props;
        console.log('props',props)
        for (let item of this.state.urlArr) {
            if (('/'+item.href).indexOf(path) !== -1) {
                console.log(path,'----','/'+item.href)
                if (path !== '/'+item.href) {
                    this.props.history.push('/'+item.href);
                    this.setState({
                        selectedKey: '/'+this.state.urlArr[0].href
                    });
                } else {
                    this.setState({
                        selectedKey: '/'+item.href
                    });
                }
                return
            }
        }
    };
   
    // _urlFetch = async () => {
    //     try {
    //         const result = await HTTP.siderChild({
    //         });
    //         console.log('result', result);
    //         this.setState({
    //             isLoding: false,
    //         });
    //         if (result.success) {
    //            this.setState({
    //                urlArr: result.data.menuList,
    //                selectedKey: '/'+result.data.menuList[0].href
    //            },function(){
    //                 this.setMenuOpen(this.props);
    //            })
    //         } else {
    //             message.error(result.message);
    //         }
    //     } catch (e) {
    //         message.error(e.message);
    //     }
    // };

    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
    };
   
    
    jumpPage = e => {
        this.props.history.push(e.key);
    }
    render(){
        const { selectedKey, isLoding, urlArr } = this.state;
        return(
            <div className="small_sider">
                <Spin size="large" spinning={isLoding}>
                    <Menu
                        theme="dark"
                        selectedKeys={[selectedKey]}
                        onClick={this.menuClick}
                    >
                    {
                        urlArr.map((item,index)=>
                        <Menu.Item key={'/'+item.href} onClick={this.jumpPage.bind(this)}>
                                <span>{item.name}</span>
                        </Menu.Item>
                    )
                    }
                    </Menu>
                </Spin>
            </div>
        )
    }
}