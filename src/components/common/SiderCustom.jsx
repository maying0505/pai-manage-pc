import React, { Component } from 'react';
import { Layout, Menu, Icon, Divider } from 'antd';
import { inject, observer } from 'mobx-react';
import "./style.less";
import SidebarSubsidiary from 'common/SidebarSubsidiary';
import { withRouter } from 'react-router';
import assetAdd from 'style/img/asset_add.png';
import assetAdd1 from 'style/img/asset_add_1.png';
import assetAudit from 'style/img/asset_audit.png';
import assetAudit1 from 'style/img/asset_audit_1.png';
import assetInquest from 'style/img/asset_inquest.png';
import assetInquest1 from 'style/img/asset_inquest_1.png';
import assetLook from 'style/img/asset_look.png';
import assetLook1 from 'style/img/asset_look_1.png';
import assetQuery from 'style/img/asset_query.png';
import assetQuery1 from 'style/img/asset_query_1.png';
import keyFile from 'style/img/key_file.png';
import keyFile1 from 'style/img/key_file_1.png';
import smallProgramCode from 'style/img/small_program_code.png';
import smallProgramCode1 from 'style/img/small_program_code_1.png';
import creatWord from 'style/img/creat_word.png';
import creatWord1 from 'style/img/creat_word_1.png';
import bidSuggest from 'style/img/bid_suggest.png';
import bidSuggest1 from 'style/img/bid_suggest_1.png';
import bidHistory from 'style/img/bid_history.png';
import bidHistory1 from 'style/img/bid_history_1.png';
import checkSystem from 'style/img/check_system.png';
import checkSystem1 from 'style/img/check_system_1.png';
import genUrl from 'style/img/gen_url.png';
import genUrl1 from 'style/img/gen_url_1.png';
import bidQuestionAnswer from 'style/img/bid_question_answer.png';
import bidQuestionAnswer1 from 'style/img/bid_question_answer_1.png';
import bookCount from 'style/img/book_count.png';
import bookCount1 from 'style/img/book_count_1.png';
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
@withRouter
@inject('pageTitle') 
@observer 
export default class SiderCustom extends Component{
    constructor(props){
        super(props);
        const { collapsed }= props;
        this.state = {
            iconArr: {
                "book_count": bookCount,
                "book_count_1": bookCount1,
                "bid_question_answer": bidQuestionAnswer,
                "bid_question_answer_1": bidQuestionAnswer1,
                "gen_url": genUrl,
                "gen_url_1": genUrl1,
                "check_system": checkSystem,
                "check_system_1": checkSystem1,
                "bid_history": bidHistory,
                "bid_history_1": bidHistory1,
                "bid_suggest": bidSuggest,
                "bid_suggest_1": bidSuggest1,
                "creat_word": creatWord,
                "creat_word_1": creatWord1,
                "small_program_code": smallProgramCode,
                "small_program_code_1": smallProgramCode1,
                "asset_add": assetAdd,
                "asset_add_1": assetAdd1,
                "asset_audit": assetAudit,
                "asset_audit_1": assetAudit1,
                "asset_inquest": assetInquest,
                "asset_inquest_1": assetInquest1,
                "asset_look": assetLook,
                "asset_look_1": assetLook1,
                "asset_query": assetQuery,
                "asset_query_1": assetQuery1,
                "key_file": keyFile,
                "key_file_1": keyFile1,
            },
            isSmallSider: false,
            collapsed: collapsed,
            urlM: [],
            path: '',
            firstHide: true, //第一次先隐藏暴露的子菜单
            selectedKey: '', //选择的路径
            openKey: '', //打开的路径（选择的上一层）
        }
    }
    componentDidMount() {
        console.log('this.props.history',this.props.history)
        this.setMenuOpen(this.props);
        this.setState({urlM: sessionStorage.getItem('sidebarArr')? JSON.parse(sessionStorage.getItem('sidebarArr')):[]})
    }
    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
        this.setMenuOpen(nextProps);
    }
    setMenuOpen = props => {
        const {path} = props;
        console.log('props',props,this.state.urlM)
        const { changePageTitle } = this.props.pageTitle;
        changePageTitle(sessionStorage.getItem('pageTitle') ? sessionStorage.getItem('pageTitle') : '');
        const sidebarArr = sessionStorage.getItem('sidebarArr')? JSON.parse(sessionStorage.getItem('sidebarArr')):[]
        for (let item of sidebarArr) {
            console.log('rrr',path,('/'+item.href))
            if (path.indexOf('/'+item.href) !== -1 ) {
                // changePageTitle(item.name);
                if (item.href === 'creat_word') {
                    this.setState({
                        openKey: '/project/'+item.href,
                        selectedKey: path,
                        path: path
                    },function(){
                        console.log('selectedKey',this.state.selectedKey)
                    });
                } else {
                    this.setState({
                        openKey: '/project/'+item.href,
                        selectedKey: '/project/'+item.href,
                        path: path
                    },function(){
                        console.log('selectedKey',this.state.selectedKey)
                    });
                }
                
            }
            if (path.indexOf('asset_detail/1') !== -1) {
                this.setState({
                    isSmallSider: true
                });
            } else {
                this.setState({
                    isSmallSider: false
                });
            }
        }
    };
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
        });
    };
    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
    };
    jumpPage = (key,name) => {
        sessionStorage.setItem('pageTitle',name);
        this.props.history.push(key)
        // history.push(key);
    }
    _getItemIconByCode = (href) => {
        console.log('href:',href,this.state.selectedKey)
        if (this.state.selectedKey.indexOf(href) !== -1) {
            return this.state.iconArr[href+'_1'] ? this.state.iconArr[href+'_1'] : this.state.iconArr['asset_add']
        } else {
            return this.state.iconArr[href] ? this.state.iconArr[href] : this.state.iconArr['asset_add']
        }
    };
    render(){
        const { path, collapsed, firstHide, openKey, selectedKey, isSmallSider  } = this.state;
        const headPortrait = sessionStorage.getItem('headPortrait');
        const name = sessionStorage.getItem("mspa_user") ? JSON.parse(sessionStorage.getItem("mspa_user")).username : '';
        return(
            <div className="yt-admin-framework-sidebar flex">
                <Sider
                trigger={null}
                collapsed={collapsed}
                >
                        <div className="header_img_box">
                            <img src={headPortrait}/>
                            <p className="text_canter">{name}</p>
                            <div className="text_canter">
                            您好！欢迎回来
                                {/* <span className="sett"><Icon type="setting" /><span style={{marginLeft: '5px'}}>设置</span></span> */}
                            </div>
                        </div>
                        <Divider/>
                        <Menu
                            theme="dark"
                            mode="inline"
                            selectedKeys={[selectedKey]}
                            onClick={this.menuClick}
                            onOpenChange={this.openMenu}
                            defaultOpenKeys={['creat_word']}
                            // openKeys={firstHide ? null : [openKey]}
                        >
                            {
                                this.state.urlM.map((item,index)=>
                                item.href === 'creat_word' ? 
                                <SubMenu
                                key='creat_word'
                                title={<span> <img className='sider_icon'
                                src={this._getItemIconByCode(item.href)}
                                alt={item.name}/>
                                <span>{item.name}</span></span>}
                                >
                                    <Menu.Item key={`/project/${item.href}/creat_word_auction`} onClick={this.jumpPage.bind(this,`/project/${item.href}/creat_word_auction`,'拍卖模板')}>
                                        <span>拍卖模板</span>
                                    </Menu.Item>
                                    <Menu.Item key={`/project/${item.href}/creat_word_sellOff`} onClick={this.jumpPage.bind(this,`/project/${item.href}/creat_word_sellOff`,'变卖模板')}>
                                        <span>变卖模板</span>
                                    </Menu.Item>
                                    {/* <Menu.Item key={`/project/${item.href}`} onClick={this.jumpPage.bind(this,`/project/${item.href}`,item.name)}>
                                        <span>拍卖模板</span>
                                    </Menu.Item> */}
                                </SubMenu> : <Menu.Item key={`/project/${item.href}`} onClick={this.jumpPage.bind(this,`/project/${item.href}`,item.name)}>
                                    <span>
                                        <img className='sider_icon'
                                          src={this._getItemIconByCode(item.href)}
                                          alt={item.name}/>
                                        <span>{item.name}</span>
                                    </span>
                                </Menu.Item>
                            )
                            }

                            
                            {/* <Menu.Item key={"/app/amap"} text="地图" onClick={this.jumpPage.bind(this)}>
                                <span><Icon type="appstore-o" /><span>地图</span></span>
                            </Menu.Item>
                            <Menu.Item key={"/app/chart/echarts"} text="图表"  onClick={this.jumpPage.bind(this)}>
                                <span><Icon type="exception" /><span>图表</span></span>
                            </Menu.Item> */}
                            {/* <SubMenu
                            key="/app/chart"
                            title={<span><Icon type="area-chart" /><span>图表</span></span>}
                            >
                                <Menu.Item key="/app/chart/echarts">
                                    <Link to={'/app/chart/echarts'}><span>echarts</span></Link>
                                </Menu.Item>
                            </SubMenu> */}
                        </Menu>
                </Sider>
                {isSmallSider && <SidebarSubsidiary path={path}/>}
            </div>
        )
    }
}