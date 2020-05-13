import React, { useState } from "react";
import { useSelector } from "react-redux";
import { View } from "react-native";

import Image from "../templates/Image";
import Video from "../templates/Video";

const Player = (props) => {
  const [playlist, setPlaylist] = useState(props.playlist);
  const [content, setContent] = useState(playlist[counter]);

  const nextPlaylist = useSelector((state) => state.playlist.nextPlaylist);

  const nextContent = () => {
    const temp = [...playlist];
    temp.splice(0, 1);
    setPlaylist(temp);

    setContent(playlist[0]);

    if (playlist.length === 1) {
      setPlaylist((playlist) => playlist.concat(nextPlaylist));
      props.nextPlaylist();
    }
  };

  return (
    <View>
      {content.format === "image" && (
        <Image source={content.fileUri} next={nextContent} />
      )}
      {content.format === "video" && (
        <Video source={content.fileUri} next={nextContent} />
      )}
    </View>
  );
};

export default Player;
