import React, { Component } from 'react';
import { Link } from 'react-router';

class Login extends Component {
  render() {
    return(
      <div className='login-page'>
        <h2>Login</h2>
        <form onSubmit={this.props.onSubmit}>
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
          <input type="submit" value="Submit" />
        </form>
        <p>
          <span>Forget your password? </span>
          <a href='#' onClick={this.props.changePasswordHandler}>
            Reset it!
          </a>
        </p>
        <p>
          Do not have an account? <Link to='/sign-up'>Create One!</Link>
        </p>
      </div>
    )
  }
}

export default Login;
