import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import App from './components/App';
import Game from './components/Game';
import Games from './components/Games';
import Login from './components/Login';
import Signup from './components/SignUp';
import ResetPassword from './components/ResetPassword';
import Home from './components/Home';
import Profile from './components/Profile';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import './css/index.css';

const store = createStore(reducer)

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/profile" component={Profile}/>
        <Route path="/games" component={Games}/>
        <Route path="/games/:id" component={Game}/>
        <Route path="/login" component={Login}/>
        <Route path="/sign-up" component={Signup}/>
        <Route path="/reset-password" component={ResetPassword}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
