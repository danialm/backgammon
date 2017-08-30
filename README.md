Please see a working version of the game [here](https://danialm.github.io/backgammon/).

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

The Backgammon is a React client application. It makes requests to the [Backgammon Api](https://github.com/danialm/backgammon-api/).

Prerequisites:
 Node > 4

To install:
```
$ git clone git@github.com:danialm/backgammon.git
$ cd backgammon
$ npm instal
$ touch .env
$ echo REACT_APP_BACKEND=http://localhost:3000/api/v1/ >> .env
```
You might need to replace `localhost:3000` with the domain of your running API. For example, to run against production use `guarded-depths-69338.herokuapp.com`.

To run:
```
$ npm start
```

To  build:
```
$ npm run build
```
