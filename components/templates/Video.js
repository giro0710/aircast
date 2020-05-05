import React from "react";
import { View, StyleSheet } from "react-native";
import { Video } from "expo-av";

const VideoTemplate = (props) => {
  const { source, next } = props;

  const handlePlaybackStatusUpdate = (playbackStatus) => {
    if (!playbackStatus.isLoaded) {
      // next content
      if (playbackStatus.error) {
        // Send error to the server for troubleshooting
        console.log(playbackStatus.error);
        next();
      }
    } else {
      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        next();
      }
    }
  };

  return (
    <View style={styles.videoContainer}>
      <Video
        source={{
          uri: source,
        }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        style={styles.video}
        onPlaybackStatusUpdate={(playbackStatus) =>
          handlePlaybackStatusUpdate(playbackStatus)
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});

export default VideoTemplate;
