import React from "react";
import { View, Image, Text, ActivityIndicator, StyleSheet } from "react-native";

const Loading = (props) => {
  return (
    <View style={styles.screen}>
      <View style={styles.centered}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/aircast-logo.png")}
            style={styles.logo}
          />
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.loading}>
          <ActivityIndicator size="small" />
          {props.text && (
            <Text style={{ ...styles.text, ...{ color: props.textColor } }}>
              {props.text}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: 800 * 0.5,
    height: 227 * 0.5,
    overflow: "hidden",
    marginBottom: 15,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  bottom: {
    position: "absolute",
    bottom: 0,
  },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  text: {
    marginLeft: 10,
  },
});

export default Loading;
