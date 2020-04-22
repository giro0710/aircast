import Playlist from "../../models/playlist";

export const SET_PLAYLIST = "SET PLAYLIST";

export const fetchPlaylist = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://aircast-test-api.herokuapp.com/playlist/54IAOAKG"
      );

      if (!response.ok) {
        throw new Error("Something went wrong.");
      }

      const resData = await response.json();

      let loadedPlaylist = [];

      for (const key in resData) {
        loadedPlaylist.push(
          new Playlist(
            resData[key].c_id,
            resData[key].name,
            resData[key].format,
            resData[key].link
          )
        );
      }

      dispatch({
        type: SET_PLAYLIST,
        playlist: loadedPlaylist,
      });
    } catch (err) {
      // Send to custom or analytic server.
      throw err;
    }
  };
};
