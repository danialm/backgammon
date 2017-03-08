import React, { Component } from 'react';

class Signup extends Component {
  render() {
    return(
      <div className='login-page'>
        <h2>Register</h2>
        <form onSubmit={this.props.onSubmit} autocomplete="off">
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
        </form>
      </div>
    )
  }
}

export default Signup;
