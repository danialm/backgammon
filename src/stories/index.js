import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import fetchMock from 'fetch-mock';

import { Button, Welcome } from '@storybook/react/demo';
import Dice from '../components/Dice';
import Profile from '../components/Profile';

import '../css/index.css';
import '../css/App.css';

storiesOf('Dice', module)
  .add('6 6', () => <Dice die1={6} die2={6} />)
  .add('1 2', () => <Dice die1={1} die2={2} />)
  .add('4 7', () => <Dice die1={4} die2={7} />)
  .add('0 0', () => <Dice die1={0} die2={0} />);

class ProfileWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = { user: {} };
  }

  render() {
      return (
        <Profile
          user={this.state.user}
          fetchSelf={
            () => this.setState({
              user: { name: "dan", email: "dan@email.com" }
            })
          }
          onChange={
            (user) => this.setState({
              user: user
            })
          }
          {...this.props} />);
  }
}

storiesOf('Profile', module)
  .add(
    'Dan Profile',
    () => {

      fetchMock
        .mock(
          (url, { method }) => {
            return url === 'http://localhost:3000/api/v1/users/me' &&
                   method === 'PATCH';
          },
          {
            id: 1,
            name: "updated name",
            email: "updated email",
            created_at: "2017-08-30T19:09:16.428Z"
          },
        );
      return (
        <ProfileWrapper
          changePasswordHandler={action("changePassword")}
          store={{
            getState: () => {},
            dispatch: () => console.log("dispatch")
          }}
        />
      );
    });
