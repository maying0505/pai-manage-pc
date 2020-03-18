import {observable, action} from 'mobx';

class PageTitle {
    @observable
    PageTitleT = '';


    @action changePageTitle = obj => {
        this.PageTitleT = obj;
    };
}

export default new PageTitle();