import { SET_PLAYLIST } from "../actions/playlist";
import Playlist from "../../models/playlist";

const initialState = {
  playlist: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PLAYLIST:
      return {
        playlist: action.playlist,
      };
  }
  return state;
};
