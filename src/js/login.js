import React, { Component } from 'react';

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
      </div>
    )
  }
}

export default Login;
