import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import stores from './store/index';
import './index.css';
import MRoute from './routes/index';
import registerServiceWorker from './registerServiceWorker';
require('es6-symbol/implement');


configure({ enforceActions: true })

ReactDOM.render(
    <Provider {...stores}>
        <MRoute />
    </Provider>
    ,
    document.getElementById('root')
);
registerServiceWorker();
