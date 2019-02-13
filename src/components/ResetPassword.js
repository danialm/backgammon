import React, { Component } from 'react';
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

  componentDidMount() {
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

    fetch(
      process.env.REACT_APP_BACKEND + 'password',
      {
        body: JSON.stringify({
          user: {
            token: t.state.user.token,
            password: t.state.user.password,
            email: t.props.user.email
          }
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT'
      })
      .then(response => {
        return Promise.all([response, response.ok || response.json()]);
      })
      .then(([response, body]) => {
        if (response.ok) {
          t.props.dispatch(
            crySuccess('resetPassword', 'Password updated successfully'));
        } else {
          throw new Error(`${response.statusText}: ${body}`);
        }
      })
      .catch(error => {
        t.props.dispatch(
          cryError('resetPassword', error.message));
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
