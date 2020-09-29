import Playlist from "../../models/playlist";
import { insertPlaylist, getPlaylist } from "../../helpers/db";
import { downloadContent } from "../../helpers/fs";
import { documentDirectory } from "expo-file-system";

export const SET_PLAYLIST = "SET_PLAYLIST";
export const FETCH_PLAYLIST = "FETCH_PLAYLIST";

const reportContentDownload = (mk_id, c_id) => {
  try {
    return fetch("https://android-api.aircast.ph/playlist", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        mk_id: mk_id,
        c_id: c_id,
      }),
    })
      .then((response) => response.json())
      .then((json) => null);
  } catch (err) {
    // Send to custom or analytic server.
    throw err;
  }
};

export const reportPlayContent = (mediaKitId, c_id) => {
  return () => {
    try {
      fetch("https://android-api.aircast.ph/playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          mk_id: mediaKitId,
          c_id: c_id,
        }),
      })
        .then((response) => response.json())
        .then((json) => null);
    } catch (err) {
      // Send to custom or analytic server.
      throw err;
    }
  };
};

export const fetchPlaylist = (mediaKitId) => {
  console.log("Nasa fetch na yung uod.")
  return async (dispatch) => {
    try {
      console.log("Tumawag na sa server ang uod.")
      const response = await fetch(
        "https://android-api.aircast.ph/playlist/" + mediaKitId
      );

      if (!response.ok) {
        throw new Error("Something went wrong.");
      }

      const resData = await response.json();

      console.log(resData)

      let loadedPlaylist = [];

      for (const key in resData) {
        if (resData[key].is_downloaded) {
          if (resData[key].is_enable) {
            loadedPlaylist.push(
              new Playlist(
                resData[key].c_id,
                resData[key].name,
                resData[key].format,
                `${documentDirectory}contents/${resData[key].file_name}`
              )
            );
          }
        } else {
          await downloadContent(resData[key].link, resData[key].file_name)
            .then((uri) => {
              if (resData[key].is_enable) {
                loadedPlaylist.push(
                  new Playlist(
                    resData[key].c_id,
                    resData[key].name,
                    resData[key].format,
                    uri
                  )
                );
              }
            })
            .catch((err) => {
              console.error(err);
            });
          reportContentDownload(mediaKitId, resData[key].c_id).then();
        }
      }

      const dbResult = await insertPlaylist(JSON.stringify(loadedPlaylist));

      dispatch({
        type: FETCH_PLAYLIST,
        nextPlaylist: loadedPlaylist,
      });
    } catch (err) {
      // Send to custom or analytic server.
      throw err;
    }
  };
};

export const updateNextPlaylist = (playlist) => {
  return async (dispatch) => {
    try {
      const dbResult = await insertPlaylist(JSON.stringify(playlist));

      console.log(dbResult);

      dispatch({
        type: FETCH_PLAYLIST,
        nextPlaylist: playlist,
      });
    } catch (err) {
      // Send to custom or analytic server.
      throw err;
    }
  }
}

export const setPlaylist = (mediaKitId) => {
  return async (dispatch) => {
    try {
      let loadedPlaylist = [];
      const dbResult = await getPlaylist();

      if (dbResult.rows._array.length === 0) {
        console.log("Playlist coming from server.");
        const response = await fetch(
          "https://android-api.aircast.ph/playlist/" + mediaKitId
        );

        if (!response.ok) {
          throw new Error("Something went wrong.");
        }

        const resData = await response.json();

        for (const key in resData) {
          if (resData[key].is_downloaded) {
            if (resData[key].is_enable) {
              loadedPlaylist.push(
                new Playlist(
                  resData[key].c_id,
                  resData[key].name,
                  resData[key].format,
                  `${documentDirectory}contents/${resData[key].file_name}`
                )
              );
            }
          } else {
            await downloadContent(resData[key].link, resData[key].file_name)
              .then((uri) => {
                if (resData[key].is_enable) {
                  loadedPlaylist.push(
                    new Playlist(
                      resData[key].c_id,
                      resData[key].name,
                      resData[key].format,
                      uri
                    )
                  );
                }
              })
              .catch((err) => {
                console.error(err);
              });
            reportContentDownload(mediaKitId, resData[key].c_id).then();
          }
        }

        if (loadedPlaylist.length > 0) {
          const dbResult = await insertPlaylist(JSON.stringify(loadedPlaylist));
        }
      } else {
        console.log("Playlist coming from local database.");
        const playlist = JSON.parse(dbResult.rows._array[0].playlist);
        for (const key in playlist) {
          loadedPlaylist.push(
            new Playlist(
              playlist[key].c_id,
              playlist[key].name,
              playlist[key].format,
              playlist[key].fileUri
            )
          );
        }
      }

      dispatch({
        type: SET_PLAYLIST,
        playlist: loadedPlaylist,
      });
    } catch (err) {
      throw err;
    }
  };
};
