import React, { Component } from 'react';
import diceIcon from '../img/dice-icon.png';
import Board from './board.js';
import Point from './point.js';
import Dice from './dice.js';
import Helper from './helper.js';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      whiteIsPlaying: true,
      white: {
        name: 'White'
      },
      black: {
        name: 'Black'
      },
      points: this.initPoints(),
      dice: {
        value: [],
        rolled: false
      },
      selected: null,
      moves: [],
      hitCheckers: []
    }
  }

  initPoints() {
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
      return null;
    });

    if(possibleEnds.indexOf(Number(key)) < 0) { return false; }

    const token = hasHits ? hitCheckers.splice(hitIndex, 1)[0] :
                            points[selected].pop();

    if(points[key].indexOf(opntToken) === 0) {
      hitCheckers.push(opntToken);
      points[key] = [];
    }

    points[key].push(token);

    const moved = Math.abs(Number(key) - Number(selected)),
          totalMoves = dice.reduce(function(a,b) { return a + b; }, 0),
          done = moved === totalMoves,
          newDice = done ? [] : Helper.getNewDice(dice, moved),
          newPossible = done ? [] : Helper.getPossibleMoves(points,
                                                     newDice,
                                                     whiteIsPlaying,
                                                     hitCheckers),
          end = newPossible.length < 1;

    this.setState({
      points: points,
      whiteIsPlaying: (end ? (!whiteIsPlaying) : whiteIsPlaying),
      selected: null,
      dice: {
        rolled: (end ? false : true),
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
          dice = [Helper.rand(), Helper.rand()],
          whiteIsPlaying = this.state.whiteIsPlaying,
          hits = this.state.hitCheckers.slice();

    if(dice[0] === dice[1]) {
      dice.push(dice[0], dice[0]);
    }

    const moves = Helper.getPossibleMoves(points, dice, whiteIsPlaying, hits);

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
        <div className='turn'>This is <strong>{turn}</strong> turn.
          <a href='#' onClick={() => this.handelDiceRoll() }>
            <img alt='roll' src={diceIcon} width='30' height='30'/>
          </a>
          <Dice value={this.state.dice.value} />
        </div>
        <Board points={this.state.points}
               selected={this.state.selected}
               possible={this.state.moves}
               onClick={ (key) => this.handleSelectPoint(key) } />
        <div className='hit'>
          <Point checkers={this.state.hitCheckers} />
        </div>
      </div>
    )
  }
}

export default Game;
