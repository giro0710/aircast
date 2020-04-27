import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as playlistActions from "../../store/actions/playlist";

import Image from "../../components/templates/Image";
import Video from "../../components/templates/Video";

const PlayerScreen = (props) => {
  const playlist = useSelector((state) => state.playlist.playlist);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [counter, setCounter] = useState(0);
  const [content, setContent] = useState();

  const dispatch = useDispatch();

  const loadPlaylist = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(playlistActions.setPlaylist()).then();
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError, setContent]);

  useEffect(() => {
    if (playlist.length === 0) {
      loadPlaylist();
    } else {
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

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Downloading default contents from server...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred! Please contact support for assistance.</Text>
        <Button title="Try Again" onPress={loadPlaylist} />
      </View>
    );
  }

  if (!content) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Downloading default contents from server...</Text>
      </View>
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

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default PlayerScreen;
