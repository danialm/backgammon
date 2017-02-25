import React, { Component } from 'react';
import { Link } from 'react-router';

class LogLink extends Component {
  render(){
    let log;
    if(this.props.token){
      log = <span>
              <span>{this.props.user.email} </span>
              <a href="#" onClick={this.props.logoutHandler} >Logout</a>
            </span>;
    }else{
      log = <Link to="/login">Login</Link>
    }

    return(
      <span>{log}</span>
    );
  }
}

export default LogLink;
