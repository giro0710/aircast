import { FETCH_PLAYLIST, SET_PLAYLIST } from "../actions/playlist";

const initialState = {
  nextPlaylist: [],
  playlist: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PLAYLIST:
      return {
        ...state,
        nextPlaylist: action.nextPlaylist,
      };
    case SET_PLAYLIST:
      return {
        playlist: action.playlist,
        nextPlaylist: action.playlist,
      };
  }
  return state;
};
