import React, { Component } from 'react';
import diceIcon from '../img/dice-icon.png';
import Board from './Board';
import Point from './Point';
import Dice from './Dice';
import Helper from './helper';
import PeerUpdater from '../lib/PeerUpdater';
import { connect } from 'react-redux';
import { cryError, clearCries } from '../actions';
import Websocket from 'react-websocket';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      whiteIsPlaying: true,
      users: null,
      points: this.initPoints(),
      dice: {
        value: [],
        rolled: false
      },
      selected: null,
      moves: [],
      hitCheckers: [],
      url: '',
      mounted: false,
      connected: false
    }

    this.handleSelectPoint = this.handleSelectPoint.bind(this);
    this.handelDiceRoll = this.handelDiceRoll.bind(this);
    this.handelDiceRoll = this.handelDiceRoll.bind(this);
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.mounted && this.state.mounted) {
      this.fetchGame();
    }
    else if(!this.peerUpdater) {
      if(this.state.users) {
        this.peerUpdater = new PeerUpdater(
          this.props.token,
          this.state.url + '/offer',
          this.state.url + '/response',
          {
            isInitiator: this._isMyTurn(),
            onConnect: () => { this.setState({ connected: true }) },
            onError: (error) => {
              this.setState({ connected: false });
              cryError("peerConnect", error.message);
            }
          });
      }
    }
    else {
      this.peerUpdater.update(Object.assign({}, this.state))
      .then(() => console.log("Updated"))
      .catch(message => cryError("peerUpdate", message));
    }
  }

  fetchGame(event) {
    event && event.preventDefault();

    const t = this,
          url = process.env.REACT_APP_BACKEND + 'games/' + t.props.id;

    fetch(
      url: url,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + t.props.token,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        return Promise.all([response, response.json()]);
      })
      .then(([response, body]) => {
        if (response.ok) {
          t.props.dispatch(clearCries());

          const state = Object.assign({}, t.state);
          state.url = body.url;
          state.users = body.users
            .sort((user1, user2) => user1.email.localeCompare(user2.email))
            .map((user, i) => {
              if (i === 0) user.isWhite = true;
              return user;
            })
            .map(user => {
              if (!user.name || user.name === "No Name") {
                user.name = user.isWhite ? "White" : "Black";
              }

              return user;
            });

          t.setState(state);
        } else {
          throw new Error(`${response.statusText}: ${body}`);
        }
      })
      .catch(error => {
        console.log(error);
        t.props.dispatch(cryError('fetchGame', error.message));
      });
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

    if(!this._isMyTurn() || !this.state.dice.rolled) { return false; }
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

  handelDiceRoll(event) {
    event.preventDefault();

    if(!this._isMyTurn() || this.state.dice.rolled) { return false; }

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

  _playingUser() {
    return this.state.users
      .find(user => this.state.whiteIsPlaying ? user.isWhite : !user.isWhite);
  }

  _isMyTurn() {
    return this._playingUser().email === this.props.user.email;
  }

  render() {
    if (!this.state.users || !this.state.connected) {
      return null;
    }

    const turn = this._playingUser().name;

    return(
      <div>
        <div className='turn'>It's <strong>{turn}</strong> turn...
          <a href='#not-a-link' onClick={this.handelDiceRoll}>
            <img alt='roll' src={diceIcon} width='30' height='30'/>
          </a>
          <Dice die1={this.state.dice.value[0]}
                die2={this.state.dice.value[1]} />
        </div>
        <Board points={this.state.points}
               selected={this.state.selected}
               possible={this.state.moves}
               onClick={this.handleSelectPoint} />
        <div className='hit'>
          <Point checkers={this.state.hitCheckers} />
        </div>
        <Websocket url={process.env.REACT_APP_BACKEND + "/cable"}
                   onMessage={this._handleWSMessage()}>
      </div>
    )
  }
}

Game = connect()(Game);
export default Game;
