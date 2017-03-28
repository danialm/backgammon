import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route, Link, NavLink, Switch
} from 'react-router-dom';
import '../css/App.css';
import $ from 'jquery';
import { cryError, cryInfo, clearCries } from '../actions';
import Crier from './Crier.js';
import Config from './Config.js';
import LogLink from './LogLink.js';
import Game from './Game';
import Games from './Games';
import Login from './Login';
import Signup from './SignUp';
import ResetPassword from './ResetPassword';
import Home from './Home';
import Profile from './Profile';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: localStorage.getItem('token'),
      user: {
        email: '',
        password: '',
        confirmPassword: ''
      }
    }

    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.fetchSelf = this.fetchSelf.bind(this);
  }

  componentWillMount() {
    if(this.state.token){
      this.fetchSelf();
    }
  }

  fetchSelf(success) {
    const t = this;
    $.ajax({
      url: Config.serverUrl + 'users/me',
      method: 'GET',
      beforeSend: function(xhr){
        xhr.setRequestHeader('Authorization', 'Bearer ' + t.state.token);
      },
      success: function(data){
        t.setState({user: data});
        if(typeof success !== 'undefined'){ success(data); }
      },
      error: function(xhr){
        t.props.dispatch(
          cryError('fetchUser', `${xhr.statusText} ${xhr.responseText}`)
        );
        localStorage.removeItem('token');
        t.setState({token: null});
      }
    });
  }

  handleLoginChange(event) {
    const user = Object.assign({}, this.state.user);
    let value = event.target.value;

    if(event.target.name === 'email'){
      let valueArray = value.split('@');
      if(valueArray[1]){
        value = [valueArray[0], valueArray[1].toLowerCase()].join('@');
      }
    }

    user[event.target.name] = value;
    this.setState({user: user});
  }

  handleLoginSubmit(event) {
    event.preventDefault();
    const t = this;

    $.ajax({
      url: Config.serverUrl + 'user_token',
      data: {
        auth: {email: t.state.user.email, password: t.state.user.password}
      },
      method: 'POST',
      success: function(data){
        localStorage.setItem('token', data.jwt);
        t.props.dispatch(clearCries());
        t.setState({token: data.jwt});
      },
      error: function(xhr){
        t.props.dispatch(
          cryError('login', `${xhr.statusText} ${xhr.responseText}`)
        );
        localStorage.removeItem('token');
      }
    });
  }

  handleRegisterSubmit(event) {
    event.preventDefault();
    const t = this;

    if(t.state.user.password.trim() === '' || t.state.user.email.trim() === ''){
      t.props.dispatch(cryError('register', 'All the fields are required!'));
      return false;
    }

    if(t.state.user.password !== t.state.user.confirmPassword){
      t.props.dispatch(cryError('register', 'Passwords do not match!'));
      return false;
    }

    $.ajax({
      url: Config.serverUrl + 'users',
      data: {
        user: {
          email: t.state.user.email,
          password: t.state.user.password
        }
      },
      method: 'POST',
      success: function(data){
        t.props.dispatch(clearCries());
        // hashHistory.push('/login');
      },
      error: function(xhr){
        t.props.dispatch(
          cryError('register', `${xhr.statusText} ${xhr.responseText}`)
        );
      }
    });
  }

  handleLogOut(event) {
    event.preventDefault();
    const user = Object.assign({}, this.state.user)

    localStorage.removeItem('token');

    user.password = ''
    user.confirmPassword = ''

    this.setState({
      token: null,
      user: user
    });
  }

  handleChangePassword(event) {
    event.preventDefault();

    const t = this;

    if(!t.state.user.email) {
      t.props.dispatch(
        cryError('changePassword', 'We need your email address!')
      );
      return false;
    }

    $.ajax({
      url: Config.serverUrl + 'password/edit',
      method: 'GET',
      data: {
        user: { email: this.state.user.email }
      },
      success: function(data){
        t.props.dispatch(cryInfo(
          'resetPassword',
          'Reset token has send to your email',
          <Link to="/reset-password">rest password</Link>
        ));
      },
      error: function(xhr){
        t.props.dispatch(
          cryError('resetPassword', `${xhr.statusText} ${xhr.responseText}`)
        );
      }
    });
  }

  render() {
    const login = <Login user={this.state.user}
                         onSubmit={this.handleLoginSubmit}
                         onChange={this.handleLoginChange}
                         changePasswordHandler={this.handleChangePassword}/>
    return(
      <Router>
        <div>
          { !this.state.token && // User is not authenticated
            <div className="container">
              <Crier />
              <Switch>
                <Route path="/login" render={() => (login) } />

                <Route path="/sign-up" render={() => (
                  <Signup user={this.state.user}
                          onSubmit={this.handleRegisterSubmit}
                          onChange={this.handleLoginChange}/>
                )}/>

                <Route path="/reset-password" render={() => (
                  <ResetPassword user={this.state.user} />
                )}/>

                <Route render={() => ( login )}/>
              </Switch>
            </div>
          }
          { this.state.token && // User is authenticated
            <div>
              <ul className="nav">
                <li><NavLink to="/" exact>Home</NavLink></li>
                <li><NavLink to="/profile">Profile</NavLink></li>
                <li><NavLink to="/games" exact>Games</NavLink></li>
                <li className="log-link">
                  <LogLink token={this.state.token}
                           user={this.state.user}
                           logoutHandler={this.handleLogOut}>
                  </LogLink>
                </li>
              </ul>
              <div className="container">
                <Crier />
                <Switch>
                  <Route exact={true} path='/' component={Home}/>

                  <Route path="/profile" render={({ match }) => (
                    <Profile user={this.state.user}
                             token={this.state.token}
                             fetchSelf={this.fetchSelf}
                             changePasswordHandler={this.handleChangePassword}
                             onChange={(user) => this.setState({user: user})}/>
                  )}/>

                  <Route path="/games" exact={true} render={({ match }) => (
                    <Games user={this.state.user}
                           token={this.state.token}/>
                  )}/>

                  <Route path="/games/:id" render={({ match }) => (
                      <Game user={this.state.user}
                            token={this.state.token}
                            id={match.params.id}/>
                  )}/>

                  <Route path="/reset-password" render={({ match }) => (
                    <ResetPassword user={this.state.user}
                                   token={this.state.token}/>
                  )}/>

                  <Route component={Home}/>
                </Switch>
              </div>
            </div>
          }
        </div>
      </Router>
    );
  }
}

App = connect()(App);
export default App;
