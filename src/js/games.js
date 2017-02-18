import React, { Component } from 'react';
import $ from 'jquery';
import Game from './game.js';
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
        console.log(xhr)
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
      }
    };

    this.fetchGames();

    this.fetchGames = this.fetchGames.bind(this);
    this.openGame = this.openGame.bind(this);
    this.createNewGame = this.createNewGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  openGame(event) {
    event.preventDefault();
    const id = $(event.target).parent().data('id'),
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
        console.log(xhr)
      }
    });
  }

  handleChange(event) {
    const newGame = Object.assign({}, this.state.newGame);
    newGame[event.target.name] = event.target.value;

    this.setState({newGame: newGame});
  }

  render() {
    const games = this.state.games.map((game, i)=>{
      const status = game.accepted ? 'Accepted' : 'Pending',
            opponent = game.users[0] ? ' with ' + game.users[0].email : '';
      return(
        <li key={game.game_id} >
          <a href='#' onClick={this.openGame}>{game.name}</a>
          {opponent} ({status})
        </li>
      );
    });

    if(this.state.game){
      return(<Game url={this.state.game.url} />)
    }else{
      return(
        <div>
          <h2>Games</h2>
          <p><a href="#" onClick={this.fetchGames}>Refresh</a></p>
          <ul className="games">{games}</ul>
          <form onSubmit={this.createNewGame}>
            <lable>
              New Game:
              <input type="text" name="name"
                     value={this.state.newGame.name}
                     onChange={this.handleChange} />
            </lable>
            <lable>
              With (email):
              <input type="text" name="email"
                     value={this.state.newGame.email}
                     onChange={this.handleChange} />
            </lable>
            <input type="submit" />
          </form>
        </div>
      );
    }
  }
}

export default Games;
