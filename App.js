import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from "react-native";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";

import playlistReducer from "./store/reducers/playlist";

import MainScreen from "./screens/player/MainScreen";

import { init, getId, setId } from "./helpers/db";
import { initContentsFolder } from "./helpers/fs";

init()
  .then(() => {
    console.log("Initialized database.");
  })
  .catch((err) => {
    console.log("Initializing db failed.");
    console.log(err);
  });

initContentsFolder()
  .then(() => {
    console.log("Contents folder created.");
  })
  .catch((err) => {
    console.log("Failed creating contents folder.");
    console.log(err);
  });

const rootReducer = combineReducers({
  playlist: playlistReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [mediaKitId, setMediaKitId] = useState(null)
  const [modalVisible, setModalVisible] = useState(false);
  const [enteredId, setEnteredId] = useState('');

  const idInputHandler = (enteredText) => {
    setEnteredId(enteredText)
  }

  const onIdConfirmHandler = () => {
    setModalVisible(!modalVisible);
    setId(enteredId)
      .then(() => {
        console.log("Media kit id set.");
        setMediaKitId(enteredId);
      })
      .catch((err) => {
        console.log("Failed retrieving media kit id.");
        console.log(err);
      });
  }

  const getMediaKitId = useCallback(async () => {
    try {
      const id = await getId();
      if (!id) {
        setModalVisible(true)
      } else {
        const retrievedId = id.id;
        setMediaKitId(retrievedId);
      }
    } catch (err) {
      console.log("Failed retrieving media kit id.");
      console.log(err);
    }
  }, [getId, setMediaKitId])

  useEffect(() => {
    if (!mediaKitId) {
      getMediaKitId();
    }
  }, [mediaKitId, getMediaKitId]);

  return (
    <Provider store={store}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Yow! Set my ID and let's get started.</Text>
            <View style={styles.center}>
              <TextInput
                placeholder='Media Kit ID'
                style={styles.input}
                onChangeText={idInputHandler}
                value={enteredId}
                autoCapitalize="characters"
                maxLength={8}
              />
            </View>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={onIdConfirmHandler}
            >
              <Text style={styles.textStyle}>Confirm</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <MainScreen mediaKitId={mediaKitId} />
    </Provider>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 60,
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    padding: 8,
    paddingHorizontal: 12,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  center: {
    alignItems: "center"
  },
  modalTitle: {
    marginBottom: 5,
    textAlign: "left"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    width: '100%',
    borderColor: "white",
    borderBottomColor: 'black',
    borderWidth: 1,
    padding: 2,
    marginBottom: 15
  },
});