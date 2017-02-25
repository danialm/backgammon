import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/App';
import Game from './js/game';
import Games from './js/games';
import Login from './js/login';
import Signup from './js/signup';
import Home from './js/home';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import './css/index.css';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/games" component={Games}/>
      <Route path="/games/:id" component={Game}/>
      <Route path="/login" component={Login}/>
      <Route path="/sign-up" component={Signup}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
