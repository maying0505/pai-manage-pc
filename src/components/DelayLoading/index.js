import React from 'react';
import { Spin } from 'antd'
import NotFound from 'components/NotFound'

const DelayLoading = ({isLoading, error}) => {
    if (isLoading) {
        return (
            <Spin tip="加载中...">
                <div style={{height: '100vh',width: '100%'}}></div>
            </Spin>
        )
    } else if (error) {
        return (
            <NotFound/>
        )
    } else {
        return null;
    }
};

export default DelayLoading;