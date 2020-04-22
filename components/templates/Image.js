import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

const ImageTemplate = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const { source } = props;

  useEffect(() => {
    if (isLoaded) {
      const timeout = setTimeout(() => {
        props.next();
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [source, isLoaded]);

  return (
    <View style={styles.imageContainer}>
      <Image
        style={styles.image}
        source={{ uri: props.source }}
        onLoad={() => setIsLoaded(true)}
      />
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
