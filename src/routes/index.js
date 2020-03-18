import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import DelayLoading from 'components/DelayLoading/index';
import Loadable from 'react-loadable';

function LoadableFunc(component) {
  return Loadable({loader: () => component, loading: DelayLoading});
}

const App = LoadableFunc(import('components/common/App'));
const Login = LoadableFunc(import('components/common/Login'));
const Home = LoadableFunc(import('components/common/Home'));
const NotFound = LoadableFunc(import('components/NotFound'));

class MRoute extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/project" component={App}/>
          <Route path="/login" component={Login}/>
          <Route component={NotFound}/>
        </Switch>
      </Router>
    );
  }
}

export default MRoute;