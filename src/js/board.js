import React, { Component } from 'react';
import Point from './point.js';

class Board extends Component {
  render() {
    const temp = Object.assign({}, this.props.points),
          possibleEnds = this.props.possible.map((p) => {
            if(p[0] === Number(this.props.selected)) { return p[1] }
            return null;
          }),
          points = Object.keys(temp).map((key)=>{
            const klass = ['point'];

            if(this.props.selected === key) { klass.push('selected'); }
            if(possibleEnds.indexOf(Number(key)) > -1) {
              klass.push('possible');
            }

            return(
              <li
                key={key}
                className={klass.join(' ')}
                onClick={() => this.props.onClick(key)} >
                <Point checkers={temp[key]} />
              </li>
            );
          });
    return(
      <div className='board'>
        <ul className='points'>{points}</ul>
      </div>
    );
  }
}

export default Board;
