/*
   合并后的 store
*/
import login from './modules/login';
import pickerPosition from './modules/pickerPosition';
import pageTitle from './modules/pageTitle';
import assetAdd from './modules/assetAdd';

const stores = {
    login,
    pickerPosition,
    pageTitle,
    assetAdd
};

export default stores;