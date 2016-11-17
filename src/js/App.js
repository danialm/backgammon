import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';

class Dice extends Component{
  render(){
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

class Point extends Component{
  render(){
    const checkers = this.props.checkers.map((checker, i)=>{
      const klass = 'checker ' + checker;
      return(<li className={klass} key={i}></li>)
    });

    return(
      <ul className='checkers'>{checkers}</ul>
    )
  }
}

class Board extends Component{
  render(){
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

class Game extends Component{
  constructor(){
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
      selected: 0,
      moves: {
        possible: [],
        total: 0
      },
      hitCheckers: []
    }
  }

  handleMove(key){
    const selected = this.state.selected,
          points = Object.assign({}, this.state.points),
          moves = Object.assign({}, this.state.moves),
          dice = this.state.dice.value.slice(),
          whiteIsPlaying = this.state.whiteIsPlaying,
          opntToken = whiteIsPlaying ? 'b' : 'w',
          hitCheckers = this.state.hitCheckers.slice();

    if(key === selected){
      this.setState({ selected: 0 });
      return false;
    }

    const possibleEnds = moves.possible.map((p)=> {
      if(p[0] === Number(selected)){ return p[1]; }
    });

    if(possibleEnds.indexOf(Number(key)) < 0) { return false; }

    const token = points[selected].pop();
    if(points[key].indexOf(opntToken) === 0){
      hitCheckers.push(opntToken);
      points[key] = [];
    }

    points[key].push(token);

    const moved = Math.abs(Number(key) - Number(selected)),
          done = moved === moves.total,
          newDice = done ? [] : getNewDice(dice, moved),
          newPossible = done ? [] :
            getPossibleMoves(points, newDice, whiteIsPlaying).possible

    this.setState({
      points: points,
      whiteIsPlaying: (done ? (!whiteIsPlaying) : whiteIsPlaying),
      selected: 0,
      dice: {
        rolled: (done ? false : true),
        value: newDice
      },
      moves: {
        possible: newPossible,
        total: (moves.total - moved)
      },
      hitCheckers: hitCheckers
    });
  }

  handleSelectPoint(key){
    const possible = this.state.moves.possible.slice();
    let valid = false;

    if(!this.state.dice.rolled){ return false; }
    if(this.state.selected){ return this.handleMove(key); }

    for(let i = 0; i < possible.length; i++){
      if(possible[i][0] === Number(key)){
        valid = true;
        break;
      }
    }

    if(!valid){ return false; }

    this.setState({selected: key});
  }

  handelDiceRoll(){
    if(this.state.dice.rolled){ return false; }

    const points = Object.assign({}, this.state.points),
          dice = [rand(), rand()];

    if(dice[0] === dice[1]){
      dice.push(dice[0], dice[0]);
    }

    const moves = getPossibleMoves(points, dice, this.state.whiteIsPlaying);

    if(moves.possible.length > 0){
      this.setState({
        dice: {
          value: dice,
          rolled: true
        },
        moves: moves
      });
    }else{
      this.setState({
        dice: {
          value: dice,
          rolled: false
        },
        moves: {
          possible: [],
          total: 0
        },
        whiteIsPlaying: !this.state.whiteIsPlaying
      });
    }
  }

  render(){
    const turn = this.state.whiteIsPlaying ?
                 this.state.white.name :
                 this.state.black.name;

    return(
      <div>
        <div className='turn'>This is <strong>{turn}</strong>
          's turn.
          <a href='#' onClick={() => this.handelDiceRoll() }> Roll</a>
          <Dice value={this.state.dice.value} />
        </div>
        <Board points={this.state.points}
               selected={this.state.selected}
               onClick={ (key) => this.handleSelectPoint(key) } />
      </div>
    )
  }
}

function initPoints(){
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

function rand(){
  return Math.floor(Math.random() * 6) + 1;
}

function getPossibleMoves(points, dice, whiteIsPlaying) {
  const op = (whiteIsPlaying ? '+' : '-'),
        token = (whiteIsPlaying ? 'w' : 'b'),
        opntToken = (whiteIsPlaying ? 'b' : 'w'),
        starts = [], moves = [];

  let totalMoves = 0, distances = [];

  for(let i = 0; i < dice.length; i++){
    distances.push(dice[i], totalMoves += dice[i]);
  }

  distances = distances.getUnique();

  for(let key in points){
    let point = points[key];
    if(point.indexOf(token) < 0){ continue; }

    starts.push(Number(key));
  }

  starts.sort(function(a, b){return a-b});
  if(starts.length === 0){ return { possible: [], total: totalMoves } }

  const allCollected = (whiteIsPlaying && starts[starts.length - 1] < 7) ||
                       (!whiteIsPlaying && starts[0] > 18)

  for(let j = 0; j < starts.length; j++){
    let start = starts[j];
    for(let i = 0; i < distances.length; i++){
      let end = eval(start + op + distances[i]);
      if(!allCollected && (end < 1 || end > 24)){ continue; }

      if(points[end].length === 0){
        moves.push([start, end]);
        continue;
      }

      if(points[end].length === 1 && points[end].indexOf(opntToken) === 0){
        moves.push([start, end]);
        continue;
      }

      if(points[end].length > 1 && points[end].indexOf(token) === 0){
        moves.push([start, end]);
        continue;
      }
    }
  }

  return { possible: moves, total: totalMoves };
}

function getNewDice(dice, moved){
  if(dice.length === 1){
    return [];
  }

  if(dice.length > 1){
    if(dice.indexOf(moved) > -1){
      return dice.diff([moved]);
    }

    if(dice[0] === dice[1]){
      return dice.slice(moved / dice[0], dice.length);
    }else{
      return [];
    }
  }
}

Array.prototype.diff = function(a) {
  return this.filter(function(i) {
    if(a.indexOf(i) < 0){
      return true
    }else{
      a = a.slice(i, i+1);
      return false;
    }
  });
};

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
};

const App = function() {
  return(<Game />);
}

export default App;
