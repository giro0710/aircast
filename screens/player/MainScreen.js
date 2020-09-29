import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Playlist from "../../models/playlist";
import * as playlistActions from "../../store/actions/playlist";
import { downloadContent } from "../../helpers/fs";
import { documentDirectory } from "expo-file-system";

import Loading from "../../components/UI/Loading";

import Player from "../../components/UI/Player";

const MainScreen = (props) => {
  const playlist = useSelector((state) => state.playlist.playlist);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Application starting..."
  );
  const [error, setError] = useState();

  const dispatch = useDispatch();

  const mediaKitId = props.mediaKitId;

  const loadPlaylist = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      setLoadingMessage("Downloading playlist from the server...");
      await dispatch(playlistActions.setPlaylist(mediaKitId)).then();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, mediaKitId, setIsLoading, setError]);

  const sendOnlineStatusReport = useCallback(async () => {
    setError(null);
    try {
      return fetch("https://android-api.aircast.ph/status/online", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          mk_id: mediaKitId,
        }),
      })
        .then((response) => response.json())
        .then((json) => null);
    } catch (err) {
      setError(err.message);
    }
  }, [mediaKitId, setError]);

  const getNextPlaylist = useCallback(async () => {
    setError(null);
    try {
      let loadedPlaylist = [];

      return fetch("https://android-api.aircast.ph/playlist/contents/" + mediaKitId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        }
      })
        .then((response) => response.json())
        .then((json) => {
          for (const key in json) {
            if (json[key].is_enable) {
              loadedPlaylist.push(
                new Playlist(
                  json[key].c_id,
                  json[key].name,
                  json[key].format,
                  `${documentDirectory}contents/${json[key].file_name}`
                )
              );
            }
          }

          if (loadedPlaylist.length === 0) {
            setIsLoading(true);
            setLoadingMessage("No playlist set. Loading...");
          } else {
            setIsLoading(false);
          }

          dispatch(playlistActions.updateNextPlaylist(loadedPlaylist)).then();
          console.log("Next playlist set!")
        });
    } catch (err) {
      setError(err.message);
      // Report to server
    }
  }, [dispatch, mediaKitId, setError, setLoadingMessage, setIsLoading]);

  const getForDownloadContents = useCallback(async () => {
    console.log("Dasssshhhhh")
    setError(null);
    try {
      return fetch("https://android-api.aircast.ph/playlist/download/" + mediaKitId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        }
      })
        .then((response) => response.json())
        .then((json) => {
          for (const key in json) {
            downloadContent(json[key].link, json[key].file_name)
              .then((uri) => {
                fetch("https://android-api.aircast.ph/playlist", {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                  },
                  body: JSON.stringify({
                    mk_id: mediaKitId,
                    c_id: json[key].c_id,
                  }),
                })
                  .then((response) => response.json())
                  .then((json) => null);
                console.log(uri)
              })
              .catch((err) => {
                console.error(err);
              });
          }
        });
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, mediaKitId, setError]);

  useEffect(() => {
    if (mediaKitId) {
      if (playlist.length === 0) {
        loadPlaylist();
      } else {
        setLoadingMessage("Completed");
      }
    }
  }, [mediaKitId, loadPlaylist, playlist]);

  useEffect(() => {
    if (mediaKitId) {
      const interval = setInterval(() => {
        sendOnlineStatusReport();
        getForDownloadContents();
      }, 60000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [mediaKitId, sendOnlineStatusReport, getForDownloadContents]);

  if (isLoading || playlist.length === 0) {
    return <Loading text={loadingMessage} />;
  }

  if (error) {
    return (
      <Loading
        text="An error occurred! Please contact support for assistance."
        textColor="red"
      />
    );
  }

  return <Player playlist={playlist} nextPlaylist={getNextPlaylist} mediaKitId={mediaKitId} />;
};

export default MainScreen;
