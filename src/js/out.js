import React, { Component } from 'react';
import Point from './point.js';

class Out extends Component {
  render() {
    const hasEnd = c => (c[1] > 24 || c[1] < 1),
          whiteCheckers = this.props.checkers.filter(c => c === 'w'),
          blackCheckers = this.props.checkers.filter(c => c === 'b'),
          possible = (!!this.props.selected) &&
                     (this.props.possible.filter(hasEnd).length > 0);

    return(
      <div className={'out ' + (possible ? 'possible' : '')}
           onClick={() => this.props.onClick('out')}>
        <div className='white'>
          <Point checkers={whiteCheckers} />
        </div>
        <div className='black'>
          <Point checkers={blackCheckers} />
        </div>
      </div>
    );
  }
}

export default Out;
