import React, { Component } from 'react';
import $ from 'jquery';
import Game from './game.js';
import Crier from './crier.js';
import Config from './config.js';

class Games extends Component {
  fetchGames() {
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
        const errors = Object.assign({}, t.state.errors);
        errors['fetch'] = 'unable to fetch games';
        t.setState({errors: errors});
      }
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      games: [],
      game: null,
      newGame: {
        name: '',
        email: ''
      },
      errors: {}
    };

    this.fetchGames();

    this.fetchGames = this.fetchGames.bind(this);
    this.openGame = this.openGame.bind(this);
    this.createNewGame = this.createNewGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.acceptGame = this.acceptGame.bind(this);
    this.removeGame = this.removeGame.bind(this);
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
        const errors = Object.assign({}, t.state.errors);
        errors['create'] = xhr.responseText;
        t.setState({errors: errors});
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
        const errors = Object.assign({}, t.state.errors);
        errors['create'] = xhr.responseText;
        t.setState({errors: errors});
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
        const errors = Object.assign({}, t.state.errors);
        errors['create'] = xhr.responseText;
        t.setState({errors: errors});
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
          <a href='#' onClick={t.openGame}>{game.name}</a>
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

    if(t.state.game){
      return(<Game url={t.state.game.url} />)
    }else{
      return(
        <div>
          <h2>Games</h2>
          <Crier errors={this.state.errors} />
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
              <input type="text" name="email"
                     value={t.state.newGame.email}
                     onChange={t.handleChange} />
            </lable>
            <input type="submit" />
          </form>
        </div>
      );
    }
  }
}

export default Games;
