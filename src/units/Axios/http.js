import axios from 'axios';
import {message} from 'antd';
import Qs from 'qs';
import {createHashHistory} from 'history'

// const DevUrl = 'http://en.nengpaifafu.com/pai-manage';
const DevUrl = 'http://test.office.nengpaifafu.com/pai-manage';         // 开发http请求地址
// const DevUrl = 'http://192.168.2.120:7001';          // 开发http请求地址
// const DevUrl = 'http://192.168.2.19:9870'; //px
// const DevUrl = 'http://192.168.1.107:9870/pai-manage'; //yyj
const ProUrl = '/pai-manage';
// 正式包http请求地址
let url = null;
const errMsg = '请求服务异常';

const Process_Env = ['development', 'production'];
let process_env = null;

switch (process.env.NODE_ENV) {
    case 'development':
    case  'test':
        url = DevUrl;
        process_env = Process_Env[0];
        break;
    case 'production':
        url = ProUrl;
        process_env = Process_Env[1];
        break;
    default:
        url = ProUrl;
        process_env = Process_Env[1];
        break;
}

class ResponseError extends Error {
    constructor(message, code, origin) {
        super(message);
        this.code = code;
        this.origin = origin;
    }
}

axios.defaults.baseURL = url;
axios.defaults.withCredentials = false;
axios.defaults.timeout = 20000;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers['Content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

const pending = [];
let cancelToken = axios.CancelToken;
const removePending = (config) => {
    for (let p in pending) {
        if (pending[p].url === config.url + '&' + config.method) {
            pending[p].cancelFunc();
            pending.splice(p, 1);
        }
    }
};


const _onHandleError = (error) => {
    console.log('_onHandleError', error);
    if (process_env === Process_Env[0]) {
        if (error.response) {
            message.error(errMsg);
            const {data, status, header} = error.response;
            data && console.log("data", error.response.data);
            status && console.log('status', error.response.status);
            header && console.log('header', error.response.header);
        }
    }

    if (error && error.response && error.response.status === 666) {
        message.error('登录失效，请重新登录');
        createHashHistory().push('/login');
    } else {
        console.log('error.message', error.response.status);
        message.error(errMsg);
        throw new Error(error);
    }
};

axios.interceptors.request.use(config => {
    console.log('config', config)
    removePending(config);
    config.cancelToken = new cancelToken((func) => {
        pending.push({url: config.url + '&' + config.method, cancelFunc: func});
    });
    config.headers = {
        // 在此处添加Token
        token: sessionStorage.getItem('token_y'),
        ...config.headers
    };
    return config;
}, error => {
    _onHandleError(error);
});

axios.interceptors.response.use(response => {
    // 在这里你可以判断后台返回数据携带的请求码
    console.log('err response', response);
    removePending(response.config);

    const {status, data, header} = response;
    if (status === 200) {
        return data;
    } else {
        if (status === 666) {
            message.error('登录失效，请重新登录');
            createHashHistory().push('/login');
            return
        }
        // 非200请求报错
        console.log('err response', response);
        throw new ResponseError(status, status, header);
    }
}, error => {
    console.log('err', error)
    _onHandleError(error);
});

const http = {};

http.get = function (url, params = {}, config = {}) {
    return axios.get(url, {params}, config);
};

http.post = function (url, params = {}, config = {}) {
    params = Qs.stringify(params)
    return axios.post(url, params, config);
};

const imgUrl = url + '/api/common/fileupload'
const fileDownUrl =  url + '/api/common/download'
const fileUrl = url + '/api/common/pdfFileupload'
const imageDown= url + '/api/download/imagePackge'//多图片下载
const imageDownAll= url + '/api/download/imagesPackge'//全部图片下载
export {http, imgUrl, fileUrl, fileDownUrl, imageDown, imageDownAll};