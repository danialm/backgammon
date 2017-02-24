import React, { Component } from 'react';
import '../css/App.css';
import $ from 'jquery';
import Crier from './crier.js';
import Games from './games.js';
import Login from './login.js';
import Signup from './signup.js';
import Config from './config.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      registering: false,
      user: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      cries: {}
    }

    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handelRegister = this.handelRegister.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);
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
        t.setState({
          token: data.jwt,
          cries: {}
        });
      },
      error: function(xhr){
        const cries = Object.assign({}, t.state.cries);
        cries['login'] = {body: 'Failed login', type: 'error'};
        t.setState({cries: cries});
      }
    });
  }

  handelRegister(event) {
    event.preventDefault();
    this.setState({
      registering: true,
      cries: {}
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
        t.setState({
          registering: false,
          cries: {}
        });
      },
      error: function(xhr){
        const cries = Object.assign({}, t.state.cries);
        cries['register'] = {body: xhr.responseText, type: 'error'};
        t.setState({cries: cries });
      }
    });
  }

  handleLogOut(event) {
    event.preventDefault();
    const user = Object.assign({}, this.state.user),
          cries = Object.assign({}, this.state.cries);

    user.password = ''
    user.confirmPassword = ''
    cries['logout'] = {body: 'success', type: 'successful'};

    this.setState({
      token: null,
      user: user,
      cries: cries
    });
  }

  handleCollapse(event) {
    event.preventDefault();
    const cries = Object.assign({}, this.state.cries),
          key = $(event.target).closest('.cry').data('key');

    delete cries[key];

    this.setState({ cries: cries});
  }

  render() {
    let template;
    let logout;

    if(this.state.token){
      logout = <p>
                 <span>{this.state.user.email} </span>
                 <a href="#" onClick={this.handleLogOut} >Logout</a>
              </p>;
    }

    if(this.state.registering){
      template = <Signup onSubmit={this.handleRegisterSubmit}
                         onChange={this.handleLoginChange}
                         user={this.state.user}/>
    }else if(this.state.token){
      template = <Games user={this.state.user}
                        token={this.state.token}
                        collapseHandler={this.handleCollapse} />
    }else{
      template =  <div>
                    <Login onSubmit={this.handleLoginSubmit}
                           onChange={this.handleLoginChange}
                           user={this.state.user} />
                    <p>
                      Do not have an account?
                      <a href='#' onClick={this.handelRegister}> Create One!</a>
                    </p>
                  </div>
    }

    return(
      <div>
        { logout }
        <Crier cries={this.state.cries} collapseHandler={this.handleCollapse} />
        { template }
      </div>
    );
  }
}

export default App;
