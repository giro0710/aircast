import { FETCH_PLAYLIST, SET_PLAYLIST } from "../actions/playlist";

const initialState = {
  playlist: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PLAYLIST:
      return {
        playlist: action.playlist,
      };
    case SET_PLAYLIST:
      return {
        playlist: action.playlist,
      };
  }
  return state;
};
