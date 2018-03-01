import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../src/components/App';
import reducer from '../../src/reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Route, Link, MemoryRouter, renderTestSequence } from 'react-router-dom';
import renderer from 'react-test-renderer';

const store = createStore(reducer);

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  removeItem(key) {
    this.store[key] = null;
  }

  getItem(key) {
    return this.store[key];
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }
};

global.localStorage = new LocalStorageMock;

const preventDefault = jest.fn();

describe('without token set', () => {
  test('renders Login with / path', () => {
    // need to be able to set the path to /
    const component = renderer.create(
      <Provider store={store}>
        <MemoryRouter initialEntries={[ '/backgammon/login' ]} initialIndex={0}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
