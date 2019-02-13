import React from 'react';
import Point from './Point.js';

const Board = props => {
  const temp = Object.assign({}, props.points),
        possibleEnds = props.possible.map((p) => {
          if(p[0] === Number(props.selected)) { return p[1]; }
          if(!props.selected && [0, 25].indexOf(p[0]) > -1) {
            return p[1];
          }
          return null;
        }),
        points = Object.keys(temp).map((key)=>{
          const klass = ['point'];

          if(props.selected === key) { klass.push('selected'); }
          if(possibleEnds.indexOf(Number(key)) > -1) {
            klass.push('possible');
          }

          return(
            <li
              key={key}
              className={klass.join(' ')}
              onClick={() => props.onClick(key)} >
              <Point checkers={temp[key]} />
            </li>
          );
        });

  return (
    <div className='board'>
      <ul className='points'>{points}</ul>
    </div>
  );
}

export default Board;
