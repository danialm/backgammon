import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import Config from './Config.js';
import { connect } from 'react-redux';
import { clearCries, cryError } from '../actions';

class Games extends Component {
  constructor(props) {
    super(props);

    this.state = {
      games: [],
      game: null,
      newGame: {
        name: '',
        email: ''
      }
    };

    this.fetchGames = this.fetchGames.bind(this);
    this.openGame = this.openGame.bind(this);
    this.createNewGame = this.createNewGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.acceptGame = this.acceptGame.bind(this);
    this.removeGame = this.removeGame.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(clearCries());
    this.fetchGames();
  }

  fetchGames(event) {
    event && event.preventDefault();

    const t = this;
    $.ajax({
      url: Config.serverUrl + 'games',
      type: 'GET',
      beforeSend: function(xhr){
        xhr.setRequestHeader('Authorization', 'Bearer ' + t.props.token);
      },
      success: function(data) {
        t.setState({games: data})
      },
      error: function(xhr) {
        t.props.dispatch(
          cryError('fetchGames', `${xhr.statusText} ${xhr.responseText}`)
        );
      }
    });
  }

  openGame(event) {
    event.preventDefault();
    const id = $(event.target).closest('li').data('id'),
          game = this.state.games.find(function(game){
            return game.id === id;
          });

    this.setState({game: game});
  }

  createNewGame(event) {
    event.preventDefault();
    const t = this;
    $.ajax({
      url: Config.serverUrl + 'games',
      type: 'POST',
      data: {game: t.state.newGame },
      beforeSend: function(xhr){
        xhr.setRequestHeader('Authorization', 'Bearer ' + t.props.token);
      },
      success: function(data) {
        const games = t.state.games.slice();
        games.push(data);
        t.setState({games: games});
      },
      error: function(xhr) {
        t.props.dispatch(
          cryError('createGame', `${xhr.statusText} ${xhr.responseText}`)
        );
      }
    });
  }

  removeGame(event) {
    event.preventDefault();
    const t = this,
          id = $(event.target).closest('li').data('id'),
          game = t.state.games.find(function(game){
            return game.id === id;
          });

    $.ajax({
      url: game.url,
      type: 'DELETE',
      beforeSend: function(xhr){
        xhr.setRequestHeader('Authorization', 'Bearer ' + t.props.token);
      },
      success: function(data) {
        const games = t.state.games.filter(g=>{
          return g.id !== game.id
        });
        t.setState({games: games});
      },
      error: function(xhr) {
        t.props.dispatch(
          cryError('removeGame', `${xhr.statusText} ${xhr.responseText}`)
        );
      }
    });
  }

  acceptGame(event) {
    event.preventDefault();
    const t = this,
          id = $(event.target).closest('li').data('id'),
          game = t.state.games.find(function(game){
            return game.id === id;
          });

    $.ajax({
      url: game.url,
      type: 'PATCH',
      data: { game: { accepted: true } },
      beforeSend: function(xhr){
        xhr.setRequestHeader('Authorization', 'Bearer ' + t.props.token);
      },
      success: function(data) {
        const games = t.state.games.filter(g=>{
          return g.id !== game.id
        });
        games.push(data);
        t.setState({games: games});
      },
      error: function(xhr) {
        t.props.dispatch(
          cryError('acceptGame', `${xhr.statusText} ${xhr.responseText}`)
        );
      }
    });
  }

  handleChange(event) {
    const newGame = Object.assign({}, this.state.newGame);
    newGame[event.target.name] = event.target.value;

    this.setState({newGame: newGame});
  }

  render() {
    const t = this,
          detectUsers = function(game){
            const out = [];
            // eslint-disable-next-line
            game.users.map(u=>{
              if(u.email === t.props.user.email) {
                out[0] = u;
              }else{
                out[1] = u;
              }
            });
            return out;
          }

    const activeGames = t.state.games.map((game, i)=>{
      const [currentUser, opponent] = detectUsers(game);

      if(!currentUser.accepted || !opponent.accepted){ return false; }

      return(
        <li key={game.id} data-id={game.id} >
          <Link to={"/games/" + game.id}>{game.name}</Link>
          {' with ' + opponent.email}
        </li>
      );
    });

    const requestedGames = t.state.games.map((game, i)=>{
      const [currentUser, opponent] = detectUsers(game);

      if(opponent.accepted || !currentUser.accepted){ return false; }

      return(
        <li key={game.id} data-id={game.id} >
          {game.name + ' with ' + opponent.email + ' '}
          <a href='#' onClick={t.removeGame}>Remove</a>
        </li>
      );
    });

    const pendingGames = t.state.games.map((game, i)=>{
      const [currentUser, opponent] = detectUsers(game);

      if(!opponent.accepted || currentUser.accepted){ return false; }

      return(
        <li key={game.id} data-id={game.id} >
          {game.name + ' with ' + opponent.email + ' '}
          <a href='#' onClick={t.acceptGame}>Accept</a>{' '}
          <a href='#' onClick={t.removeGame}>Remove</a>
        </li>
      );
    });

    return(
      <div>
        <h2>Games</h2>
        <p><a href="#" onClick={t.fetchGames}>Refresh</a></p>
        <h3>Active</h3>
        <ul className="games">{activeGames}</ul>
        <h3>Requested</h3>
        <ul className="games">{requestedGames}</ul>
        <h3>Pending</h3>
        <ul className="games">{pendingGames}</ul>
        <form onSubmit={t.createNewGame}>
          <lable>
            New Game:
            <input type="text" name="name"
                   value={t.state.newGame.name}
                   onChange={t.handleChange} />
          </lable>
          {' '}
          <lable>
            with (email):
            <input type="email" name="email"
                   value={t.state.newGame.email}
                   onChange={t.handleChange} />
          </lable>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

Games = connect()(Games);
export default Games;
