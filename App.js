import React from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";

import playlistReducer from "./store/reducers/playlist";

import MainScreen from "./screens/player/MainScreen";

import { init } from "./helpers/db";
import { initContentsFolder } from "./helpers/fs";

init()
  .then(() => {
    console.log("Initialized database.");
  })
  .catch((err) => {
    console.log("Initializing db failed.");
    console.log(err);
  });

initContentsFolder()
  .then(() => {
    console.log("Contents folder created.");
  })
  .catch((err) => {
    console.log("Failed creating contents folder.");
    console.log(err);
  });

const rootReducer = combineReducers({
  playlist: playlistReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <MainScreen />
    </Provider>
  );
}
