import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Layout,BackTop,Spin} from 'antd';
import 'style/index.less';

import SiderCustom from './SiderCustom';
import HeaderCustom from './HeaderCustom';
import AssetAdd from 'page/asset-add';
import AssetAudit from 'page/asset-audit';
import AssetQuery from 'page/asset-query';
import AssetInquest from 'page/asset-inquest';
import KeyFile from 'page/key-file';
import InquestHouseProperty from 'page/asset-inquest/detail/inquest-house-property';
import AssetLook from 'page/asset-look';
import LookHouseProperty from 'page/asset-look/detail/look-house-property';
import HouseProperty from 'components/AssetDetail/house-property';
import SmallProgramCode from 'page/small-program-code';
import BidQuestionAnswer from 'page/bid-question-answer';
import CreatWordAuction from 'page/creat-word/creat-word-auction';
import CreatWordSellOff from 'page/creat-word/creat-word-sellOff';
import BidSuggest from 'page/bid-suggest';
import BidHistory from 'page/bid-history';
import BidMessage from 'page/bid-message';
import CheckSystem from 'page/check-system';
import GenUrl from 'page/gen-url';
import BookCount from 'page/book-count';
import NotFound from 'components/NotFound';

const {Content} = Layout;

export default class App extends Component {
    state = {
        loading: false,
        collapsed: localStorage.getItem("mspa_SiderCollapsed") === "true",
        pageRouters: [
            {
                href: '/project/book_count',
                component: BookCount
            },
            {
                href: '/project/check_system',
                component: CheckSystem
            },
            {
                href: '/project/bid_message',
                component: BidMessage
            },
            {
                href: '/project/bid_history',
                component: BidHistory
            },
            {
                href: '/project/bid_suggest',
                component: BidSuggest
            },
            {
                href: '/project/bid_suggest/asset_detail/house_property/:userId/:ifSuggest',
                component: HouseProperty
            },
            {
                href: '/project/bid_suggest/asset_detail/other/:userId/:ifSuggest',
                component: HouseProperty
            },
            {
                href: '/project/bid_suggest/asset_detail/vehicle/:userId/:ifSuggest',
                component: HouseProperty
            },
            {
                href: '/project/creat_word/creat_word_sellOff',
                component: CreatWordSellOff
            },
            {
                href: '/project/creat_word/creat_word_auction',
                component: CreatWordAuction
            },
            {
                href: '/project/bid_question_answer',
                component: BidQuestionAnswer
            },
            {
                href: '/project/small_program_code',
                component: SmallProgramCode
            },
            {
                href: '/project/asset_add',
                component: AssetAdd
            },
            {
                href: '/project/asset_add/asset_detail/house_property/:userId',
                component: HouseProperty
            },
            {
                href: '/project/asset_add/asset_detail/other/:userId',
                component: HouseProperty
            },
            {
                href: '/project/asset_add/asset_detail/vehicle/:userId',
                component: HouseProperty
            },
            {
                href: '/project/asset_add/asset_detail/land/:userId',
                component: HouseProperty
            },
            {
                href: '/project/asset_add/asset_detail/1/house_property',
                component: HouseProperty
            },
            {
                href: '/project/asset_add/asset_detail/1/vehicle',
                component: HouseProperty
            },
            {
                href: '/project/asset_add/asset_detail/1/land',
                component: HouseProperty
            },
            {
                href: '/project/asset_add/asset_detail/1/other',
                component: HouseProperty
            },
            {
                href: '/project/asset_audit',
                component: AssetAudit
            },
            {
                href: '/project/asset_audit/asset_detail/house_property/:userId',
                component: HouseProperty
            },
            {
                href: '/project/asset_audit/asset_detail/other/:userId',
                component: HouseProperty
            },
            {
                href: '/project/asset_audit/asset_detail/vehicle/:userId',
                component: HouseProperty
            },
            {
                href: '/project/asset_audit/asset_detail/land/:userId',
                component: HouseProperty
            },
            {
                href: '/project/asset_query',
                component: AssetQuery
            },
            {
                href: '/project/asset_query/asset_detail/house_property/:userId',
                component: HouseProperty
            },
            {
                href: '/project/asset_query/asset_detail/other/:userId',
                component: HouseProperty
            },
            {
                href: '/project/asset_query/asset_detail/vehicle/:userId',
                component: HouseProperty
            },
            {
                href: '/project/asset_query/asset_detail/land/:userId',
                component: HouseProperty
            },
            {
                href: '/project/asset_inquest',
                component: AssetInquest
            },
            {
                href: '/project/asset_inquest/asset_detail/house_property/:isM/:userId',
                component: InquestHouseProperty
            },
            {
                href: '/project/asset_inquest/asset_detail/other/:isM/:userId',
                component: InquestHouseProperty
            },
            {
                href: '/project/asset_inquest/asset_detail/vehicle/:isM/:userId',
                component: InquestHouseProperty
            },
            {
                href: '/project/asset_inquest/asset_detail/land/:isM/:userId',
                component: InquestHouseProperty
            },
            {
                href: '/project/asset_look',
                component: AssetLook
            },
            {
                href: '/project/asset_look/asset_detail/house_property/:isM/:userId',
                component: LookHouseProperty
            },
            {
                href: '/project/asset_look/asset_detail/other/:isM/:userId',
                component: LookHouseProperty
            },
            {
                href: '/project/asset_look/asset_detail/vehicle/:isM/:userId',
                component: LookHouseProperty
            },
            {
                href: '/project/asset_look/asset_detail/land/:isM/:userId',
                component: LookHouseProperty
            },
            {
                href: '/project/key_file',
                component: KeyFile
            },
            {
                href: '/project/gen_url',
                component: GenUrl
            },
        ]
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        }, function () {
            localStorage.setItem("mspa_SiderCollapsed", this.state.collapsed);
        });
    };

    componentDidMount() {
        //保存Sider收缩
        if (localStorage.getItem("mspa_SiderCollapsed") === null) {
            localStorage.setItem("mspa_SiderCollapsed", false);
        }
    }

    render() {
        const {collapsed,pageRouters} = this.state;
        const {location} = this.props;
        let name;
        if (sessionStorage.getItem("mspa_user") === null) {
            return <Redirect to="/login"/>
        } else {
            name = location.state === undefined ? JSON.parse(sessionStorage.getItem("mspa_user")).username : location.state.username;
        }
        let isSmallSider = false;
        if (this.props.location.pathname.indexOf('asset_detail/1') !== -1) {
            isSmallSider = true;
        }
        return (
            <div className='yt-admin-framework'>
                <Spin key="yt-admin-framework-layout" spinning={this.state.loading} size="large">
                    <HeaderCustom collapsed={collapsed} toggle={this.toggle} username={name}/>
                    <SiderCustom collapsed={collapsed} path={location.pathname}/>
                    <Content className="yt-admin-framework-content" style={{marginLeft : `${isSmallSider? '340px' : '220px'}`}}>
                    <Switch>
                            {pageRouters.map((item,index)=>
                                <Route exact key={index} path={item.href} component={item.component} />
                            )}
                            <Route component={NotFound}/>
                        </Switch>
                    </Content>
                    
                    <BackTop style={{right: '40px', bottom: '60px'}}/>
                </Spin>
            </div>
        );
    }
}
