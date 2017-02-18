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
      errors: {}
    }

    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handelRegister = this.handelRegister.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  handleLoginChange(event) {
    const user = Object.assign({}, this.state.user);
    user[event.target.name] = event.target.value;

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
          errors: {}
        });
      },
      error: function(xhr){
        const errors = Object.assign({}, t.state.errors);
        errors['login'] = 'Failed login';
        t.setState({errors: errors});
      }
    });
  }

  handelRegister(event) {
    event.preventDefault();
    this.setState({
      registering: true,
      errors: {}
    });
  }

  handleRegisterSubmit(event) {
    event.preventDefault();
    const t = this,
          errors = Object.assign({}, t.state.errors);

    if(t.state.user.password.trim() === '' ||
       t.state.user.email.trim() === '') {
      errors['register'] = 'All the fields are required!';
      t.setState({errors: errors});
      return false;
    }

    if(t.state.user.password !== t.state.user.confirmPassword){
      errors['register'] = 'Passwords do not match!';
      t.setState({errors: errors});
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
          errors: {}
        });
      },
      error: function(xhr){
        const errors = Object.assign({}, t.state.errors);
        console.log(xhr);
        errors['register'] = xhr.responseText;
        t.setState({errors: errors });
      }
    });
  }

  handleLogOut(event) {
    event.preventDefault();
    const user = Object.assign({}, this.state.user);
    user.password = ''
    user.confirmPassword = ''
    this.setState({
      token: null,
      user: user
    });
  }

  render() {
    let template;
    let logout;

    if(this.state.token){
      logout = <p><a href="#" onClick={this.handleLogOut} >Logout</a></p>;
    }

    if(this.state.registering){
      template = <Signup onSubmit={this.handleRegisterSubmit}
                         onChange={this.handleLoginChange}
                         user={this.state.user}/>
    }else if(this.state.token){
      template = <Games user={this.state.user} token={this.state.token} />
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
        <Crier errors={this.state.errors} />
        { template }
      </div>
    );
  }
}

export default App;
