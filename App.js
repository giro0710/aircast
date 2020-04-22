import React from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";

import playlistReducer from "./store/reducers/playlist";

import PlayerScreen from "./screens/player/PlayerScreen";

const rootReducer = combineReducers({
  playlist: playlistReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <PlayerScreen />
    </Provider>
  );
}
