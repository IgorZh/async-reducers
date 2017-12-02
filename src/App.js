import React, { Component } from "react";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";

import logo from "./logo.svg";
import { combineReducers } from "redux-immutable";
import companies from "./reducers/companies";
import entities from "./reducers/entities";
import CompaniesList from "./containers/CompaniesList";
import CompaniesEdit from "./containers/CompaniesEdit";
import "./App.css";

const middlewares = [thunk];

const enhancers = [applyMiddleware(...middlewares)];
const reducer = combineReducers({
  companies,
  entities
});
const composeEnhancers =
  process.env.NODE_ENV !== "production" &&
  typeof window === "object" &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const store = createStore(reducer, composeEnhancers(...enhancers));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <CompaniesList />
          <CompaniesEdit />
        </div>
      </Provider>
    );
  }
}

export default App;
