import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { connect } from 'react-redux';
import { clearCries, cryError } from '../actions';

class Games extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mounted: false,
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

  componentDidMount() {
    this.setState({mounted: true});
  }

  componentDidUpdate(prevProps, prevState) {
    if(!prevState.mounted && this.state.mounted) {
      this.fetchGames();
    }
  }

  fetchGames(event) {
    event && event.preventDefault();

    const t = this;

    fetch(
      process.env.REACT_APP_BACKEND + 'games',
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + t.props.token
        }
      })
      .then(response => {
        return Promise.all([response, response.json()]);
      })
      .then(([response, body]) => {
        if (response.ok) {
          t.props.dispatch(clearCries());
          t.setState({games: body});
        } else {
          throw new Error(`${response.statusText}: ${body}`);
        }
      })
      .catch(error => {
        t.props.dispatch(cryError('fetchGames', error.message));
      });
  }

  openGame(event) {
    event.preventDefault();
    const id = $(event.target).closest('li').data('id'),
          game = this.state.games.find(game => {
            return game.id === id;
          });

    this.setState({game: Object.assign({}, game)});
  }

  createNewGame(event) {
    event.preventDefault();
    const t = this;
    fetch(
      process.env.REACT_APP_BACKEND + 'games',
      {
        method: 'POST',
        body: JSON.stringify({game: t.state.newGame }),
        headers: {
          'Authorization': 'Bearer ' + t.props.token,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        return Promise.all([response, response.json()]);
      })
      .then(([response, data]) => {
        t.props.dispatch(clearCries());
        if (response.ok) {
          const games = t.state.games.slice();
          games.push(data);
          t.setState({games: games});
        } else {
          throw new Error(`${response.statusText}: ${data}`);
        }
      })
      .catch(error => {
        t.props.dispatch(cryError('createGame', error.message));
      });
  }

  removeGame(event) {
    event.preventDefault();
    const t = this,
          id = $(event.target).closest('li').data('id'),
          game = t.state.games.find(function(game){
            return game.id === id;
          });

    fetch(
      game.url,
      {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + t.props.token,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        return Promise.all([response, response.json()]);
      })
      .then(([response, data]) => {
        if(response.ok) {
          t.props.dispatch(clearCries());
          const games = t.state.games.filter( g => {
            return g.id !== game.id
          });
          t.setState({games: games.slice()});
        } else {
          throw new Error(`${response.statusText}: ${data}`);
        }
      })
      .catch(error => {
        t.props.dispatch(cryError('removeGame', error.message));
      });
  }

  acceptGame(event) {
    event.preventDefault();
    const t = this,
          id = $(event.target).closest('li').data('id'),
          game = t.state.games.find(function(game){
            return game.id === id;
          });

    fetch(
      game.url,
      {
        method: 'PATCH',
        body: JSON.stringify({ game: { accepted: true } }),
        headers: {
          'Authorization': 'Bearer ' + t.props.token,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        return Promise.all([response, response.json()]);
      })
      .then(([response, data]) => {
        if(response.ok) {
          t.props.dispatch(clearCries());
          const games = t.state.games.filter(g=>{
            return g.id !== game.id
          });
          games.push(data);
          t.setState({games: games.slice()});
        } else {
          throw new Error(`${response.statusText}: ${data}`);
        }
      })
      .catch(error => {
        t.props.dispatch(cryError('acceptGame', error.message));
      });
  }

  handleChange(event) {
    const newGame = Object.assign({}, this.state.newGame);
    newGame[event.target.name] = event.target.value;

    this.setState({newGame: newGame});
  }

  render() {
    const t = this,
          detectUsers = game => {
            const out = [];
            game.users.forEach(user => {
              if(user.email === t.props.user.email) {
                out[0] = user;
              }else{
                out[1] = user;
              }
            });
            return out;
          };

    const activeGames = t.state.games.map((game, i) => {
      const [currentUser, opponent] = detectUsers(game);

      if(!currentUser.accepted || !opponent.accepted){ return false; }

      return(
        <li key={game.id} data-id={game.id} >
          <Link to={"/games/" + game.id}>{game.name}</Link>
          {' with ' + opponent.email}
        </li>
      );
    });

    const requestedGames = t.state.games.map((game, i) => {
      const [currentUser, opponent] = detectUsers(game);

      if(opponent.accepted || !currentUser.accepted){ return false; }

      return(
        <li key={game.id} data-id={game.id} >
          {game.name + ' with ' + opponent.email + ' '}
          <a href='#not-a-link' onClick={t.removeGame}>Remove</a>
        </li>
      );
    });

    const pendingGames = t.state.games.map((game, i) => {
      const [currentUser, opponent] = detectUsers(game);

      if(!opponent.accepted || currentUser.accepted){ return false; }

      return(
        <li key={game.id} data-id={game.id} >
          {game.name + ' with ' + opponent.email + ' '}
          <a href='#not-a-link' onClick={t.acceptGame}>Accept</a>{' '}
          <a href='#not-a-link' onClick={t.removeGame}>Remove</a>
        </li>
      );
    });

    return(
      <div>
        <h2>Games</h2>
        <p><a href="#not-a-link" onClick={t.fetchGames}>Refresh</a></p>
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
