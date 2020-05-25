import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as playlistActions from "../../store/actions/playlist";

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

  const loadPlaylist = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      setLoadingMessage("Downloading playlist from the server...");
      await dispatch(playlistActions.setPlaylist()).then();
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  const sendOnlineStatusReport = useCallback(async () => {
    try {
      return fetch("https://aircast-test-api.herokuapp.com/status/online", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          mk_id: "54IAOAKG",
        }),
      })
        .then((response) => response.json())
        .then((json) => null);
    } catch (err) {
      setError(err.message);
    }
  }, [setError]);

  useEffect(() => {
    if (playlist.length === 0) {
      loadPlaylist();
    } else {
      setLoadingMessage("Completed");
    }
  }, [loadPlaylist, playlist]);

  useEffect(() => {
    const interval = setInterval(() => {
      sendOnlineStatusReport();
      console.log("Online report sent.");
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [sendOnlineStatusReport]);

  const getNextPlaylist = useCallback(async () => {
    try {
      await dispatch(playlistActions.fetchPlaylist()).then();
    } catch (err) {
      // Report to server
    }
  }, [dispatch]);

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

  return <Player playlist={playlist} nextPlaylist={getNextPlaylist} />;
};

export default MainScreen;
