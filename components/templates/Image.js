import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

const ImageTemplate = (props) => {
  const { source, next } = props;

  useEffect(() => {
    const timeout = setTimeout(() => {
      next();
    }, 15000);

    return () => {
      clearTimeout(timeout);
    };
  }, [next]);

  return (
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={{ isStatic: true, uri: source }} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImageTemplate;
