import { observable, computed, action } from 'mobx';

class LoginStore {
    @observable sidebarArr = '[]';
    @observable headPortraitt = '';

    @action
    changeSidebarArr = sidebarArr => {
        this.sidebarArr = sidebarArr;
    };
    changeHeadPortrait = url => {
        this.headPortrait = url;
    };

   
}

// 返回一个实例
export default new LoginStore();