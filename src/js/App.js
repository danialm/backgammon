import React, { Component } from 'react';
import { IndexLink, hashHistory } from 'react-router';
import '../css/App.css';
import $ from 'jquery';
import Crier from './crier.js';
import Config from './config.js';
import NavLink from './NavLink';
import LogLink from './log-link.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: localStorage.getItem('token'),
      user: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      cries: {}
    }

    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);
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
        const cries = Object.assign({}, t.state.cries);
        cries['fetchUser'] = {
          body: 'Faild to fetch user info',
          type: 'error'
        };
        localStorage.removeItem('token');
        t.setState({
          cries: cries,
          token: null
        });
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
      data: { auth: t.state.user },
      method: 'POST',
      success: function(data){
        localStorage.setItem('token', data.jwt);
        t.setState({
          token: data.jwt,
          cries: {}
        });

        hashHistory.push('/games');
      },
      error: function(xhr){
        const cries = Object.assign({}, t.state.cries);
        cries['login'] = {
          body: `${xhr.statusText} ${xhr.responseText}`,
          type: 'error'
        };
        localStorage.removeItem('token');
        t.setState({cries: cries});
      }
    });
  }

  handleRegisterSubmit(event) {
    event.preventDefault();
    const t = this,
          cries = Object.assign({}, t.state.cries);

    if(t.state.user.password.trim() === '' ||
       t.state.user.email.trim() === '') {
      cries['register'] = {body: 'All the fields are required!', type: 'error'};
      t.setState({cries: cries});
      return false;
    }

    if(t.state.user.password !== t.state.user.confirmPassword){
      cries['register'] = {body: 'Passwords do not match!', type: 'error'};
      t.setState({cries: cries});
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
        t.setState({cries: {}});

        hashHistory.push('/login');
      },
      error: function(xhr){
        cries['register'] = {
          body: `${xhr.statusText} ${xhr.responseText}`,
          type: 'error'
        };
        t.setState({cries: cries});
      }
    });
  }

  handleLogOut(event) {
    event.preventDefault();
    const user = Object.assign({}, this.state.user),
          cries = Object.assign({}, this.state.cries);

    localStorage.removeItem('token');

    user.password = ''
    user.confirmPassword = ''
    cries['logout'] = {body: 'success', type: 'successful'};

    this.setState({
      token: null,
      user: user,
      cries: cries
    });

    hashHistory.push('/login');
  }

  handleCollapse(event) {
    event.preventDefault();
    const cries = Object.assign({}, this.state.cries),
          key = $(event.target).closest('.cry').data('key');

    delete cries[key];

    this.setState({cries: cries});
  }

  render() {
    let props, clonedChildren;

    if(this.props.children) {
      if(this.props.children.type.name === 'Login'){
        props = {
          user: this.state.user,
          onSubmit: this.handleLoginSubmit,
          onChange: this.handleLoginChange
        }
      }else if(this.props.children.type.name === 'Signup') {
        props = {
          user: this.state.user,
          onSubmit: this.handleRegisterSubmit,
          onChange: this.handleLoginChange
        }
      }else if(['Games', 'Game'].indexOf(this.props.children.type.name) > -1 ) {
        props = {
          user: this.state.user,
          token: this.state.token
        }
      }else if(this.props.children.type.name === 'Profile') {
        props = {
          token: this.state.token,
          user: this.state.user,
          fetchSelf: this.fetchSelf,
          onChange: (user) => this.setState({user: user})
        }
      }else{
        props = {
          user: this.state.user
        }
      }

      clonedChildren = React.cloneElement(this.props.children, props);
    }else{
      clonedChildren = null;
    }

    return(
      <div>
        <ul className="nav">
          <li><IndexLink to="/" activeClassName="active">Home</IndexLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><NavLink to="/games">Games</NavLink></li>
          <li className="log-link">
            <LogLink token={this.state.token}
                     user={this.state.user}
                     logoutHandler={this.handleLogOut}>
            </LogLink>
          </li>
        </ul>
        <Crier cries={this.state.cries} collapseHandler={this.handleCollapse} />
        { clonedChildren }
      </div>
    );
  }
}

export default App;
