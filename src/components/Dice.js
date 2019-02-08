import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Dice extends Component {
  render() {
    const dice = [this.props.die1, this.props.die2].map((v, i) => {
      return(
        <li key={i} className={'die number-' + v}></li>
      )
    });

    return(
      <ul className='dice'>{dice}</ul>
    )
  }
}

Dice.ACCEPTABLE_DICE = [1, 2, 3, 4, 5, 6];

Dice.propTypes = {
  die1: PropTypes.oneOf(Dice.ACCEPTABLE_DICE),
  die2: PropTypes.oneOf(Dice.ACCEPTABLE_DICE)
};

export default Dice;
