import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View } from "react-native";
import { reportPlayContent } from "../../store/actions/playlist";

import Image from "../templates/Image";
import Video from "../templates/Video";

const Player = (props) => {
  const [playlist, setPlaylist] = useState(props.playlist);
  const [content, setContent] = useState(playlist[0]);

  const nextPlaylist = useSelector((state) => state.playlist.nextPlaylist);

  const dispatch = useDispatch();

  const nextContent = () => {
    dispatch(reportPlayContent(props.mediaKitId, content.c_id));

    const temp = [...playlist];
    temp.splice(0, 1);
    setPlaylist(temp);

    setContent(playlist[0]);

    if (temp.length === 1) {
      console.log("Isang content na lang natira. Kailangan ng bago.")
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
