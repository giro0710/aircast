import React, { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as playlistActions from "../../store/actions/playlist";

import Loading from "../../components/UI/Loading";

import Image from "../../components/templates/Image";
import Video from "../../components/templates/Video";

const MainScreen = (props) => {
  const playlist = useSelector((state) => state.playlist.playlist);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Application starting..."
  );
  const [error, setError] = useState();
  const [counter, setCounter] = useState(0);
  const [content, setContent] = useState();

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
  }, [dispatch, setIsLoading, setError, setContent]);

  const loadNewPlaylist = useCallback(async () => {
    setError(null);
    try {
      await dispatch(playlistActions.fetchPlaylist()).then();
    } catch (err) {
      setError(err.message);
    }
    console.log("Done updating playlist.");
    console.log(playlist.length);
  }, [dispatch, setError]);

  useEffect(() => {
    if (playlist.length === 0) {
      loadPlaylist();
    } else {
      setLoadingMessage("Completed");
      setContent(playlist[0]);
    }
  }, [loadPlaylist, playlist]);

  const nextContext = () => {
    if (counter < playlist.length - 1) {
      setCounter((counter) => counter + 1);
    } else {
      setCounter(0);
    }
    setContent(playlist[counter]);
  };

  if (isLoading || !content) {
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

  return (
    <View>
      {content.format === "image" && (
        <Image source={content.fileUri} next={nextContext} />
      )}
      {content.format === "video" && (
        <Video source={content.fileUri} next={nextContext} />
      )}
    </View>
  );
};

export default MainScreen;
