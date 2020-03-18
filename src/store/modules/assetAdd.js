import {observable, action} from 'mobx';

class AssetAdd {
    @observable
    assetBaseId = '';


    @action changeAssetBaseId = string => {
        this.assetBaseId = string;
    };
}

export default new AssetAdd();