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
      await dispatch(playlistActions.fetchPlaylist()).then();
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
    setContent(playlist[counter]);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    loadPlaylist();
  }, [loadPlaylist]);

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

  return (
    <View>{content && <Image source={content.link} next={nextContext} />}</View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default PlayerScreen;
