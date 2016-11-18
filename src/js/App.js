import React, { Component } from 'react';
// import logo from './logo.svg';
import '../css/App.css';

class Dice extends Component {
  render() {
    const dice = this.props.value.map((v, i) => {
      return(
        <li key={i} className={'die number-' + v}></li>
      )
    });

    return(
      <ul className='dice'>{dice}</ul>
    )
  }
}

class Point extends Component {
  render() {
    const checkers = this.props.checkers.map((checker, i)=>{
      const klass = 'checker ' + checker;
      return(<li className={klass} key={i}></li>)
    });

    return(
      <ul className='checkers'>{checkers}</ul>
    )
  }
}

class Board extends Component {
  render() {
    const temp = Object.assign({}, this.props.points),
    points = Object.keys(temp).map((key)=>{
      const klass = 'point' + (this.props.selected === key ? ' selected' : '')
      return(
        <li
          key={key}
          className={klass}
          onClick={() => this.props.onClick(key)} >
          <Point checkers={temp[key]} />
          {key}
        </li>
      );
    });

    return(
      <div className='board'>
        <ul className='points'>{points}</ul>
      </div>
    )
  }
}

class Game extends Component {
  constructor() {
    super();

    this.state = {
      whiteIsPlaying: true,
      white: {
        name: 'White'
      },
      black: {
        name: 'Black'
      },
      points: initPoints(),
      dice: {
        value: [],
        rolled: false
      },
      selected: null,
      moves: [],
      hitCheckers: ['w', 'w', 'b']
    }
  }

  handleMove(key) {
    const whiteIsPlaying = this.state.whiteIsPlaying,
          t = (whiteIsPlaying ? 'w' : 'b'),
          hitPoint = (whiteIsPlaying ? 0 : 25),
          hitCheckers = this.state.hitCheckers.slice(),
          hitIndex = hitCheckers.indexOf(t),
          hasHits = (hitIndex > -1),
          selected = hasHits ? hitPoint : this.state.selected,
          points = Object.assign({}, this.state.points),
          moves = this.state.moves.slice(),
          dice = this.state.dice.value.slice(),
          opntToken = (whiteIsPlaying ? 'b' : 'w');

    if(key === selected) {
      this.setState({ selected: null });
      return false;
    }

    const possibleEnds = moves.map((p)=> {
      if(p[0] === Number(selected)) { return p[1]; }
    });

    if(possibleEnds.indexOf(Number(key)) < 0) { return false; }

    const token = hasHits ? hitCheckers.splice(hitIndex, 1) : points[selected].pop();
    if(points[key].indexOf(opntToken) === 0) {
      hitCheckers.push(opntToken);
      points[key] = [];
    }

    points[key].push(token);

    const moved = Math.abs(Number(key) - Number(selected)),
          totalMoves = dice.reduce(function(a,b) { return a + b; }, 0),
          done = moved === totalMoves,
          newDice = done ? [] : getNewDice(dice, moved),
          newPossible =
            done ? [] : getPossibleMoves(points, newDice, whiteIsPlaying, hitCheckers);

    this.setState({
      points: points,
      whiteIsPlaying: (done ? (!whiteIsPlaying) : whiteIsPlaying),
      selected: null,
      dice: {
        rolled: (done ? false : true),
        value: newDice
      },
      moves: newPossible,
      hitCheckers: hitCheckers
    });
  }

  handleSelectPoint(key) {
    const possible = this.state.moves.slice(),
          hitCheckers = this.state.hitCheckers.slice(),
          whiteIsPlaying = this.state.whiteIsPlaying,
          token = (whiteIsPlaying ? 'w' : 'b'),
          hasHits = (hitCheckers.indexOf(token) > -1);

    let valid = false;

    if(!this.state.dice.rolled) { return false; }
    if(this.state.selected || hasHits) { return this.handleMove(key); }

    for(let i = 0; i < possible.length; i++) {
      if(possible[i][0] === Number(key)) {
        valid = true;
        break;
      }
    }

    if(!valid) { return false; }

    this.setState({selected: key});
  }

  handelDiceRoll() {
    if(this.state.dice.rolled) { return false; }

    const points = Object.assign({}, this.state.points),
          dice = [rand(), rand()],
          whiteIsPlaying = this.state.whiteIsPlaying,
          hits = this.state.hitCheckers.slice();

    if(dice[0] === dice[1]) {
      dice.push(dice[0], dice[0]);
    }

    const moves = getPossibleMoves(points, dice, whiteIsPlaying, hits);

    if(moves.length > 0) {
      this.setState({
        dice: {
          value: dice,
          rolled: true
        },
        moves: moves
      });
    } else {
      this.setState({
        dice: {
          value: dice,
          rolled: false
        },
        moves: [],
        whiteIsPlaying: !this.state.whiteIsPlaying
      });
    }
  }

  render() {
    const turn = this.state.whiteIsPlaying ?
                 this.state.white.name :
                 this.state.black.name;

    return(
      <div>
        <div className='turn'>This is <strong>{turn}</strong>
          \'s turn.
          <a href='#' onClick={() => this.handelDiceRoll() }> Roll</a>
          <Dice value={this.state.dice.value} />
        </div>
        <Board points={this.state.points}
               selected={this.state.selected}
               onClick={ (key) => this.handleSelectPoint(key) } />
        <div className='hit'>
          <Point checkers={this.state.hitCheckers} />
        </div>
      </div>
    )
  }
}

function allIsCollected(starts, whiteIsPlaying) {
  return (whiteIsPlaying && starts[starts.length - 1] < 7) ||
         (!whiteIsPlaying && starts[0] > 18);
}

function getStartPoints(points, whiteIsPlaying, hasHits) {
  const token = whiteIsPlaying ? 'w' : 'b',
        array = [];

  if(hasHits){
    return whiteIsPlaying ? [0] : [25];
  }

  for(let key in points) {
    let point = points[key];
    if(point.indexOf(token) < 0) { continue; }

    array.push(Number(key));
  }

  return array.sort(function(a, b) { return a-b; });
}

function acceptableEnd(end, endPoint, whiteIsPlaying, allCollected) {
  const opntToken = (whiteIsPlaying ? 'b' : 'w');

  if(!allCollected && end < 1 || end > 24) { return false; }

  if(endPoint.length > 1 && endPoint.indexOf(opntToken) === 0) { return false; }

  return true;
}

function getPossibleMovesForPoint(point, points, _dice, _end, moves, whiteIsPlaying, allCollected) {
  if(_dice.length < 1) { return true; }

  const op = (whiteIsPlaying ? '+' : '-'),
        dice = _dice.slice(),
        die = dice.pop(),
        end = eval(_end + op + die);

  if(acceptableEnd(end, points[end], whiteIsPlaying, allCollected)) {
    moves.push([point, end]);

    getPossibleMovesForPoint(point, points, dice, end, moves, whiteIsPlaying, allCollected);
  }
}

function getPossibleMoves(points, dice, whiteIsPlaying, hitCheckers) {
  const token = (whiteIsPlaying ? 'w' : 'b'),
        hasHits = (hitCheckers.indexOf(token) > -1),
        starts = getStartPoints(points, whiteIsPlaying, hasHits),
        moves = [];

  if(starts.length === 0) { return []; }

  const allCollected = allIsCollected(starts, whiteIsPlaying);

  for(let j = 0; j < starts.length; j++) {
    let start = starts[j];

    getPossibleMovesForPoint(start, points, dice, start, moves, whiteIsPlaying, allCollected);
    getPossibleMovesForPoint(start, points, dice.reverse(), start, moves, whiteIsPlaying, allCollected);
  }

  return moves;
}

function getNewDice(dice, moved) {
  if(dice.length === 1) {
    return [];
  }

  if(dice.length > 1) {
    if(dice.indexOf(moved) > -1) {
      return dice.diff([moved]);
    }

    if(dice[0] === dice[1]) {
      return dice.slice(moved / dice[0], dice.length);
    } else {
      return [];
    }
  }
}

function initPoints() {
  const points = {};

  for(let i = 1; i < 25; i++) {
    points[i] = [];
  }

  points[1] = ['w', 'w'];
  points[6] = ['b', 'b', 'b', 'b', 'b'];
  points[8] = ['b', 'b', 'b'];
  points[12] = ['w', 'w', 'w', 'w', 'w'];
  points[13] = ['b', 'b', 'b', 'b', 'b'];
  points[17] = ['w', 'w', 'w'];
  points[19] = ['w', 'w', 'w', 'w', 'w'];
  points[24] = ['b', 'b'];

  return points;
}

function rand() {
  return Math.floor(Math.random() * 6) + 1;
}

Array.prototype.diff = function(a) {
  return this.filter(function(i) {
    if(a.indexOf(i) < 0) {
      return true
    } else {
      a = a.slice(i, i+1);
      return false;
    }
  });
};

const App = function() {
  return(<Game />);
}

export default App;
