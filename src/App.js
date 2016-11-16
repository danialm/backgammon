import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

class Dice extends Component{
  render(){
    return(
      <ul className='dice'>
        <li className='die'>{this.props.value[0]}</li>
        <li className='die'>{this.props.value[1]}</li>
      </ul>
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
        value: [null, null],
        rolled: false
      },
      selected: 0
    }
  }

  handelDiceRoll(){
    if(this.state.dice.rolled){ return false; }

    this.setState({
      dice: {
        value: [rand(), rand()],
        rolled: true
      }
    });
  }

  handleMove(key){
    console.log(key);
    if(key === this.state.selected){
      this.setState({ selected: 0 });
      return true;
    }

    const points = Object.assign({}, this.state.points),
          token = points[this.state.selected].pop();

    points[key].push(token);
    this.setState({
      points: points,
      whiteIsPlaying: !this.state.whiteIsPlaying,
      selected: 0,
      dice: {
        rolled: false,
        value: [null, null]
      }
    });
  }

  handleSelectPoint(key){
    if(!this.state.dice.rolled){ return false; }
    if(this.state.selected){ return this.handleMove(key); }

    if(this.state.whiteIsPlaying && this.state.points[key].indexOf('w') < 0){
      return false;
    }

    if(!this.state.whiteIsPlaying && this.state.points[key].indexOf('b') < 0){
      return false;
    }

    this.setState({selected: key});
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

const App = function() {
  return(<Game />);
}

export default App;
