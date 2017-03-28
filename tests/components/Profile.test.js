import React, { Component } from 'react';
import $ from 'jquery';
import Config from './Config.js';
import EditableFiled from './EditableFiled.js';
import { connect } from 'react-redux';
import { clearCries, cryError } from '../actions';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      lastFetchedUser: {}
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.resetUser = this.resetUser.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(clearCries());
    this.props.fetchSelf(data => this.setState({lastFetchedUser: data}));
  }

  componentWillReceiveProps(nextProps) {
    const user = Object.assign({}, nextProps.user);

    this.setState({user: user})
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
        t.props.dispatch(
          cryError('update', `${xhr.statusText} ${xhr.responseText}`)
        );
        t.setState({user: lastFetchedUser});
      }
    });
  }

  resetUser() {
    const user = Object.assign({}, this.state.lastFetchedUser);
    this.setState({user: user});
  }

  render() {
      if(!this.state.user.email){ return(<h2>Profile</h2>); }
      return (
        <div>
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
                         reset={this.resetUser}
                         placeHolder="Your name" />
          <p>
            <a href="#" onClick={this.props.changePasswordHandler}>
              Change Password
            </a>
          </p>
        </div>
      );
  }
}

Profile = connect()(Profile);
export default Profile;
