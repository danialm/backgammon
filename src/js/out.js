import React, { Component } from 'react';
import Point from './point.js';

class Out extends Component {
  render() {
    const selected = this.props.selected,
          whiteCheckers = this.props.checkers.filter(c=>c === 'w'),
          blackCheckers = this.props.checkers.filter(c=>c === 'b'),
          ends = this.props.possible.filter(c=>c[0] === Number(selected))
                                    .filter(c=>(c[1] > 24 || c[1] < 1))
                                    .map(c=>c[1]),
          possible = (!!selected) && (ends.length > 0);

          console.log(selected);
          console.log(ends);

    return(
      <div className={'out' + (possible ? ' possible' : '')}
            onClick={ () => this.props.onClick(ends[0]) }>
        <ul className='white'>
          <Point checkers={whiteCheckers} />
        </ul>
        <ul className='black'>
          <Point checkers={blackCheckers} />
        </ul>
      </div>
    );
  }
}

export default Out;

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}
