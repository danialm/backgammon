import React, { Component } from 'react';
import Point from './point.js';
import Out from './out.js';

class Board extends Component {
  render() {
    const temp = Object.assign({}, this.props.points),
          possibleEnds = this.props.possible.map((p) => {
            if(p[0] === Number(this.props.selected)) { return p[1]; }
            if(!this.props.selected && [0, 25].indexOf(p[0]) > -1) {
              return p[1];
            }
            return null;
          }),
          points = Object.keys(temp).map((key)=>{
            const klass = ['point'];

            if(this.props.selected === key) { klass.push('selected'); }
            if(possibleEnds.indexOf(Number(key)) > -1) {
              klass.push('possible');
            }

            return(
              <Point onClick={(key) => this.props.onClick(key)}
                     key={key.toString()}
                     checkers={temp[key]}
                     value={key}
                     klass={klass.join(' ')}/>
            );
          });

    return(
      <div className='board'>
        <ul className='points'>
          {points}
        </ul>

        <ul className='hit'>
          <Point checkers={this.props.hitChechers} />
        </ul>

        <Out checkers={this.props.outCheckers}
             possible={this.props.possible}
             selected={this.props.selected}
             onClick={(key) => this.props.onClick(key)} />
      </div>
    );
  }
}

export default Board;
