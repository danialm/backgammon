import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearCries } from '../actions';

class Home extends Component {

  componentDidMount() {
    this.props.dispatch(clearCries());
  }

  render() {
    return(
      <h2>Welcome to Backgammon!</h2>
    )
  }
}

Home = connect()(Home);
export default Home;
