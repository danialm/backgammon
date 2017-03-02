import React, { Component } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import Config from './config.js';
import Crier from './crier.js';
import EditableFiled from './EditableFiled.js';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cries: {},
      user: {},
      lastFetchedUser: {}
    }

    this.handleCollapse = this.handleCollapse.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.resetUser = this.resetUser.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  componentWillMount() {
    this.props.fetchSelf(data => this.setState({lastFetchedUser: data}));
  }

  componentWillReceiveProps(nextProps) {
    const user = Object.assign({}, nextProps.user);

    this.setState({user: user})
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

    if(event.target.name === 'email'){
      let valueArray = value.split('@');
      if(valueArray[1]){
        value = [valueArray[0], valueArray[1].toLowerCase()].join('@');
      }
    }

    user[event.target.name] = value;
    this.setState({user: user});
  }

  handleSave(name) {
    const user = {},
          lastFetchedUser = Object.assign({}, this.state.lastFetchedUser),
          t = this;

    user[name] = this.state.user[name];

    $.ajax({
      url: Config.serverUrl + 'users/me',
      method: 'PATCH',
      data: {
        user: user
      },
      beforeSend: function(xhr){
        xhr.setRequestHeader('Authorization', 'Bearer ' + t.props.token);
      },
      success: function(data){
        t.setState({lastFetchedUser: data});
        t.props.onChange(data);
      },
      error: function(xhr){
        const cries = Object.assign({}, t.state.cries);
        cries['update'] = {
          body: `${xhr.statusText} ${xhr.responseText}`,
          type: 'error'
        };
        t.setState({
          cries: cries,
          user: lastFetchedUser
        });
      }
    });
  }

  resetUser() {
    const user = Object.assign({}, this.state.lastFetchedUser);
    this.setState({user: user});
  }

  handleChangePassword(event) {
    event.preventDefault();

    const t = this,
          cries = Object.assign({}, t.state.cries);

    $.ajax({
      url: Config.serverUrl + 'password/edit',
      method: 'GET',
      data: {
        user: { email: this.state.lastFetchedUser.email }
      },
      success: function(data){
        cries['resetPassword'] = {
          body: 'Reset token has send to your email',
          type: 'info',
          link: <Link to="/reset-password">rest password</Link>
        }
        t.setState({cries: cries});
      },
      error: function(xhr){
        cries['update'] = {
          body: `${xhr.statusText} ${xhr.responseText}`,
          type: 'error'
        };
        t.setState({cries: cries});
      }
    });
  }

  render() {
      return (
        <div>
          <Crier cries={this.state.cries} collapseHandler={this.handleCollapse} />
          <h2>Profile</h2>
          <EditableFiled type='email'
                         name='email'
                         value={this.state.user.email}
                         onChange={this.handleChange}
                         onSave={this.handleSave}
                         reset={this.resetUser} />

          <EditableFiled type='text'
                         name='name'
                         value={this.state.user.name}
                         onChange={this.handleChange}
                         onSave={this.handleSave}
                         reset={this.resetUser} />
          <p>
            <a href="#" onClick={this.handleChangePassword}>Change Password</a>
          </p>
        </div>
      );
  }
}

export default Profile;
