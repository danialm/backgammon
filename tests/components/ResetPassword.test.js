import React, { Component } from 'react';
import $ from 'jquery';
import Config from './Config.js';
import { connect } from 'react-redux';
import { cryError, crySuccess, clearCries } from '../actions';
import { Link } from 'react-router-dom';

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        token: '',
        password: '',
        confirmPassword: ''
      }
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(clearCries());
  }

  handleChange(event) {
    const user = Object.assign({}, this.state.user);
    let value = event.target.value;

    user[event.target.name] = value;
    this.setState({user: user});
  }

  handleSubmit(event) {
    event.preventDefault();

    const t = this;

    if(t.state.user.password.trim() === '' || t.state.user.token.trim() === ''){
      t.props.dispatch(
        cryError('resetPassword', 'All the fields are required!')
      );
      return false;
    }

    if(t.state.user.password !== t.state.user.confirmPassword){
      t.props.dispatch(
        cryError('resetPassword', 'Passwords do not match!')
      );
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
        console.log('goooooz');
        t.props.dispatch(
          crySuccess('resetPassword', 'Password updated successfully')
        );
      },
      error: function(xhr){
        t.props.dispatch(
          cryError('resetPassword', `${xhr.statusText} ${xhr.responseText}`)
        );
      }
    });
  }

  render() {
    return(
      <div>
        <h2>Reset Password</h2>
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
          <p>{ !this.props.token && <Link to='/login'>Login</Link>}</p>
        </form>
      </div>
    );
  }
}

ResetPassword = connect()(ResetPassword);
export default ResetPassword;
