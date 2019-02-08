import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import md5 from 'md5';

class LogLink extends Component {
  render(){
    let log;
    const profileUrl = 'https://www.gravatar.com/avatar/' +
                        md5(this.props.user.email.toLowerCase()) +
                        '?s=50&d=retro';
    if(this.props.token){
      log = <span>
              <img src={profileUrl}
                   alt={this.props.user.email}
                   className="profile-pic"/>
              <a href="#not-a-link" onClick={this.props.logoutHandler} >Logout</a>
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
