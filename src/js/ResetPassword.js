import React, { Component } from 'react';
import $ from 'jquery';
import Crier from './crier.js';
import Config from './config.js';

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cries: {},
      user: {
        token: '',
        password: '',
        confirmPassword: ''
      }
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);
  }

  handleCollapse(event) {
    event.preventDefault();
    const cries = Object.assign({}, this.state.cries),
          key = $(event.target).closest('.cry').data('key');

    delete cries[key];
    this.setState({cries: cries});
  }

  handleChange(event) {
    const user = Object.assign({}, this.state.user);
    let value = event.target.value;

    user[event.target.name] = value;
    this.setState({user: user});
  }

  handleSubmit(event) {
    event.preventDefault();

    const t = this, cries = {};

    if(t.state.user.password.trim() === '' ||
       t.state.user.token.trim() === '') {
      cries['resetPassword'] = {body: 'All the fields are required!', type: 'error'};
      t.setState({cries: cries});
      return false;
    }

    if(t.state.user.password !== t.state.user.confirmPassword){
      cries['resetPassword'] = {body: 'Passwords do not match!', type: 'error'};
      t.setState({cries: cries});
      return false;
    }

    $.ajax({
      url: Config.serverUrl + 'password',
      data: {
        user: {
          token: t.state.user.token,
          password: t.state.user.password,
          email: t.props.user.email
        }
      },
      method: 'PUT',
      success: function(data){
        cries['resetPassword'] = {
          body: 'Password updated successfully',
          type: 'success'
        }
        t.setState({cries: cries});
      },
      error: function(xhr){
        cries['resetPassword'] = {
          body: `${xhr.statusText} ${xhr.responseText}`,
          type: 'error'
        };
        t.setState({cries: cries});
      }
    });
  }

  render() {
    return(
      <div>
        <Crier cries={this.state.cries} collapseHandler={this.handleCollapse} />
        <h2>Reset ResetPassword</h2>
        <form onSubmit={this.handleSubmit}>
          <p>
            <label>
              Email:
              <input type="email"
                     name="email"
                     value={this.props.user.email}
                     disabled="disabled"/>
            </label>
          </p>
          <p>
            <label>
              Token:
              <input type="text"
                     name="token"
                     value={this.state.user.token}
                     onChange={this.handleChange} />
            </label>
          </p>
          <p>
            <label>
              New Password:
              <input type="password"
                     name="password"
                     value={this.state.user.password}
                     onChange={this.handleChange} />
            </label>
          </p>
          <p>
            <label>
              Confirm Password:
              <input type="password"
                     name="confirmPassword"
                     value={this.state.user.confirmPassword}
                     onChange={this.handleChange} />
            </label>
          </p>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default ResetPassword;
