import React, { Component } from 'react';
import EditableFiled from './EditableFiled.js';
import { connect } from 'react-redux';
import { clearCries, cryError } from '../actions';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.resetUser = this.resetUser.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(clearCries());
    this.props.fetchSelf(this.setState({ mounted: true }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user.email !== this.props.user.email ||
        prevProps.user.name !== this.props.user.name) {

      this.setState({user: Object.assign({}, this.props.user)});
    }
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

  handleSave(attrName) {
    const user = {},
          t = this;

    user[attrName] = this.state.user[attrName];

    fetch(
      process.env.REACT_APP_BACKEND + 'users/me',
      {
        method: 'PATCH',
        body: JSON.stringify({
          user: user
        }),
        headers: {
          'Authorization': 'Bearer ' + t.props.token,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(data => {
        t.props.onChange(data);
      })
      .catch(error => {
        t.props.dispatch(cryError('update', `${error}`));
        t.setState({user: this.props.user});
      });
  }

  resetUser() {
    const user = Object.assign({}, this.props.user);
    this.setState({user: user});
  }

  render() {
      if(this.state.user.email === null){ return(<h2>Profile</h2>); }
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
            <button className="link" onClick={this.props.changePasswordHandler}>
              Change Password
            </button>
          </p>
        </div>
      );
  }
}

Profile = connect()(Profile);
export default Profile;
