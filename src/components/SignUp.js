import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearCries } from '../actions';
import { Link } from 'react-router-dom';

class Signup extends Component {

  componentDidMount() {
    this.props.dispatch(clearCries());
  }

  render() {
    return(
      <div className='login-page'>
        <h2>Register</h2>
        <form onSubmit={this.props.onSubmit} autoComplete="off">
          <p>
            <label>
              Email:
              <input type="email"
                     name="email"
                     value={this.props.user.email}
                     onChange={this.props.onChange} />
            </label>
          </p>
          <p>
            <label>
              Password:
              <input type="password"
                     name="password"
                     value={this.props.user.password}
                     onChange={this.props.onChange} />
            </label>
          </p>
          <p>
            <label>
              Confirm Password:
              <input type="password"
                     name="confirmPassword"
                     value={this.props.user.confirmPassword}
                     onChange={this.props.onChange} />
            </label>
          </p>
          <input type="submit" value="Submit" />
          <p><Link to='/login'>Login</Link></p>
        </form>
      </div>
    )
  }
}

Signup = connect()(Signup);
export default Signup;
