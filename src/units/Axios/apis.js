//const prefix = '/lhb-manage/a/rest/credit/weixin'; // api地址前缀
const prefix = '/api';
const apis = (config => {
    Object.keys(config).forEach((item) => {
        config[item] = `${prefix}${config[item]}`;
    });
    return config;
})({
    login: '/login',//登录
    updatepwd: '/login/updatepwd',//修改密码
    dictJudge: '/dict/arealist',//获取法庭法官
    assetType: '/dict/getAssetType',//资产类型
    assetStatus: '/common/getAllStatus',//获取资产状态
    fileupload: '/common/fileupload',//图片上传
    areaGet: '/dict/common/area',//获取省市区
    getBidList: '/pc/getbidPc',//获取标的列表
    getBidList1: '/pc/getbidPcAudit',//获取标的审核列表
    getBidList2: '/pc/getbidPc2',//获取标的查询列表
    saveHouseBid: '/pc/saveHouseBid',//房产录单保存
    saveOtherBid: '/pc/saveOtherBid',//其他保存
    saveCarBid: '/pc/saveCarBid',//机动车录单保存
    saveLandBid: '/pc/saveLandBid',//土地录单保存
    houseStandardInfo: '/common/bidInfo',//获取房产的拍卖详情、表的详情和其他
    getOutsideOperator: '/common/getOutsideOperator',//获取所在公司的外勤人员
    setFinalPrice: '/common/setFinalPrice',//成交价提交按钮
    operationProcess: '/process/getByAssetId',//获取操作流程
    changestatus: '/changestatus/save',//更改状态提交
    getstatus: '/getstatus',//获取状态
    getstatusByAssetId: '/getstatusByAssetId',//状态更改记录
    releaseGetData: '/common/getLink',//标的发布获取数据
    getRelease: '/common/release',//发布
    viewSampleGet: '/pc/viewSample',//引领看样提交
    rollbackGet: '/common/rollback',//审核驳回
    adoptGet: '/common/adopt',//审核通过
    saveHouse: '/pc/saveHouse',//标的检查保存-房产
    saveCar: '/pc/saveCar',//标的检查保存-车辆
    saveLand: '/pc/saveLand',//标的检查保存-土地
    submitInquest: '/outside/submit',//标的勘验提交
    lookSampleTimes: '/common/lookSample',//看样时间
    lookSampleInfo: '/outside/getSampleBid',//看样信息
    lookSampleDetail: '/pc/getInquestBid2',//看样详情
    getbidInvestigate: '/pc/getbidInvestigate',//勘验列表
    getbidSample: '/pc/getbidSample',//看样列表
    saveRetinueInquest: '/common/saveRetinue2',//陪同任务人保存-勘验
    saveRetinueLook: '/common/saveRetinue',//陪同任务人保存-看样
    saveSummary: '/outside/saveSummary',//看样保存
    reNumberVerification: '/outside/reservation',//预约号验证
    isMaster: '/pc/getMaster',//是否主要任务人
    inquestStatusGet: '/pc/inquestStatus',//确认勘验陪同任务人
    lookStatusGet: '/pc/inquestStatus2',//确认勘验陪同任务人
    getInquestBid: '/pc/getInquestBid',//勘验详情
    inspectSubmit: '/outside/inspectSubmit',//检查提交
    saveRemake: '/pc/saveRemark',//看样小结保存
    sampleSubmit: '/outside/sampleSubmit',//看样提交
    keyList: '/key/list',//钥匙档案列表
    keyIdentify: '/key/identify',//钥匙识别
    keyRecordSave: '/key/save',//钥匙记录提交
    keyRecordSaveReturn: '/key/saveReturn',//钥匙记录归还提交
    keyRecordDetail: '/key/getKey',//钥匙记录详情
    keyCollarList: '/key/historyList',//钥匙领用记录列表
    keyCollarSave: '/key/saveHistory',//钥匙领用提交
    keyCollarReturnSave: '/key/saveReturnHistory',//钥匙领用归还提交
    releaseGetData1: '/asset/publish/getDetail',//发布前查询
    releaseSave: '/asset/publish/save',//标的发布
    imageDownList: '/download/imageList',//图片下载列表
    imageDown: '/download/imagePackge',//多图片下载
    imageDownAll: '/download/imagesPackge',//全部图片下载
    saveHouseInquest: '/pc/saveHouseInquest',//房产勘验保存
    saveCarInquest: '/pc/saveCarInquest',//机动车勘验保存
    saveLandInquest: '/pc/saveLandInquest',//土地勘验保存
    assetBookList: '/pc/AssetBookList',//预约人列表
    getQrcode: '/outside/qrcode',//生成二维码
    imageRemove: '/common/asset/deleteImage',//图片删除
    bidQrcode: '/pc/bidQrcode',//小程序码
    waitList: '/message/waitList',//标的问答-待解答列表
    saveAnswer: '/message/saveAnswer',//标的问答-回答保存
    quesList: '/message/quesList',//标的问答-答案列表
    getIdByNumbers: '/message/getIdByNumbers',//标的问答-点击标的物编号跳转详情
    isupgrade: '/isupgrade',//是否升级中
    dictJudge1: '/word/processArea',//省市区法院
    auctionWord: '/word/auction',//拍卖合同生成
    sellOffWord: '/word/auction2',//变卖合同生成
    suggestSubmit: '/supervisor/saveOpinion',//监拍状态提交
    supervisorList: '/supervisor/list',//标的监拍列表
    supervisorHistoryList: '/supervisor/history',//监拍记录列表
    supervisorMessage: '/supervisor/message',//未读消息条数
    supervisorMessageList: '/supervisor/messageList',//未读消息列表
    checkSystemList: '/check/checkSystem',//纠错系统列表
    checkUpdateStatus: '/check/updateStatus',//纠错系统处理接口
    genUrlGet: '/pc/genUrl',//生成小程序链接
    bookUnreadList: '/book/unreadList',//未读预约列表
    bookSetRead: '/book/setRead',//标记为已知晓
    bookAssetBookList: '/book/assetBookList',//获取标的预约列表
});

export default apis;