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

  useEffect(() => {
    if (playlist.length === 0) {
      loadPlaylist();
    } else {
      setLoadingMessage("Completed");
    }
  }, [loadPlaylist, playlist]);

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
