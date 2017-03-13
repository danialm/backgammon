import React, { Component } from 'react';
import { IndexLink, hashHistory, Link } from 'react-router';
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
      data: {
        auth: {email: t.state.user.email, password: t.state.user.password}
      },
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

  handleChangePassword(event) {
    event.preventDefault();

    const t = this,
          cries = Object.assign({}, t.state.cries);

    if(!this.state.user.email) {
      cries['changePassword'] = {
        body: 'We need your email address!',
        type: 'error'
      };
      t.setState({cries: cries});
      return false;
    }

    $.ajax({
      url: Config.serverUrl + 'password/edit',
      method: 'GET',
      data: {
        user: { email: this.state.user.email }
      },
      success: function(data){
        cries['resetPassword'] = {
          body: 'Reset token has send to your email',
          type: 'info',
          link: <Link to="/reset-password">rest password</Link>
        }
        t.setState({cries: cries});
      },
      error: function(xhr){
        cries['update'] = {
          body: `${xhr.statusText} ${xhr.responseText}`,
          type: 'error'
        };
        t.setState({cries: cries});
      }
    });
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
      props = {user: this.state.user};

      if(typeof this.props.children.props.route.path !== 'undefined') {
        if(this.props.children.props.route.path === '/login'){
          props['onSubmit'] = this.handleLoginSubmit;
          props['onChange'] = this.handleLoginChange;
          props['changePasswordHandler'] = this.handleChangePassword;
        }else if(this.props.children.props.route.path === '/sign-up') {
          props['onSubmit'] = this.handleRegisterSubmit;
          props['onChange'] = this.handleLoginChange;
        }else if(this.props.children.props.route.path.indexOf('/games') === 0) {
          props['token'] = this.state.token;
        }else if(this.props.children.props.route.path === '/profile') {
          props['token'] = this.state.token;
          props['fetchSelf'] = this.fetchSelf;
          props['changePasswordHandler'] = this.handleChangePassword;
          props['onChange'] = (user) => this.setState({user: user});
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
