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
import { createStore, combineReducers, applyMiddleware } from "redux"; // DATA MANAGEMENT
import { Provider } from "react-redux"; // DATA MANAGEMENT
import ReduxThunk from "redux-thunk"; // API REQUEST

import playlistReducer from "./store/reducers/playlist";

import MainScreen from "./screens/player/MainScreen";

import { init, getId, setId } from "./helpers/db"; // ALL DATABASE FUNCTION
import { initContentsFolder } from "./helpers/fs"; // ALL FILE SYSTEM FUNCTION

// CREATING LOCAL DATABASE AND TABLES
init()
  .then(() => {
    console.log("Initialized database.");
  })
  .catch((err) => {
    console.log("Initializing db failed.");
    console.log(err);
  });

// CREATING CONTENT WHERE DOWNLOADED CONTENT BEING STORED
initContentsFolder()
  .then(() => {
    console.log("Contents folder created.");
  })
  .catch((err) => {
    console.log("Failed creating contents folder.");
    console.log(err);
  });

// INITIATING REDUCER
const rootReducer = combineReducers({
  playlist: playlistReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [mediaKitId, setMediaKitId] = useState(null)
  const [modalVisible, setModalVisible] = useState(false);
  const [enteredId, setEnteredId] = useState('');
  const [isCorrectInput, setIsCorrectInput] = useState(false);
  const [isInputTouched, setIsInputTouched] = useState(false);
  const [inputErrorMessage, setInputErrorMessage] = useState('*Please input the correct media kit id.');

  // HANDLING ONCHANGE TEXT EVENT OF TEXTINPUT FOR SAVING USER INPUT ID IN STATE
  const idInputHandler = (enteredText) => {
    setEnteredId(enteredText)
    setIsInputTouched(true);
  }

  // HANDLING ID CONFIRMATION/SUBMITION EVENT
  const onIdConfirmHandler = () => {
    if (enteredId.trim().length === 0) {
      // CHECK IF THE USER REALLY ENTER AN ID OR A BLANK SPACE
      setInputErrorMessage("Please input media kit id.")
      setIsCorrectInput(false);
    } else if (enteredId.trim().length < 8) {
      // CHECK IF THE ID INPUTTED BY THE USER HAS 8 CHARACTERS
      setInputErrorMessage("Media kit id must be 8 characters.")
      setIsCorrectInput(false);
    } else {
      // IF ID REQUIREMENT MET, SEND IT TO SERVER FOR VERIFICATION IF IT EXISTING
      try {
        return fetch("https://android-api.aircast.ph/mediakit/" + enteredId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json())
          .then((json) => {
            if (json.kind === "found") {
              // IF ID EXIST
              if (json.is_activated === 0) {
                // CHECK IF ITS NOT YET ACTIVATED, HIDE ENTER ID MODAL
                setModalVisible(!modalVisible);
                // SAVE ID TO LOCAL DATABASE SO IT WONT ASK AGAIN NEXT RUN
                setId(enteredId)
                  .then(() => {
                    console.log("Media kit id set.");
                    // SET ID TO STATE
                    setMediaKitId(enteredId);
                    // SEND ID ACTIVATION TO SERVER
                    try {
                      return fetch("https://android-api.aircast.ph/mediakit/activate", {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json; charset=UTF-8",
                        },
                        body: JSON.stringify({
                          mk_id: enteredId,
                        }),
                      })
                        .then((response) => response.json())
                        .then((json) => null);
                    } catch (err) {
                      setError(err.message);
                    }
                  })
                  .catch((err) => {
                    console.log("Failed retrieving media kit id.");
                    console.log(err);
                  });
                setIsCorrectInput(true);
              } else {
                setInputErrorMessage("Media kit id has already activated. Please input a new one.")
                setIsCorrectInput(false);
              }
            } else {
              setInputErrorMessage("Media kit id doesn't exist in the database.")
              setIsCorrectInput(false);
            }
          });
      } catch (err) {
        setError(err.message);
      }
    }
  }

  // FUNCTION TO GET MEDIA KIT ID SAVED IN LOCAL DATABASE
  const getMediaKitId = useCallback(async () => {
    try {
      const id = await getId();
      if (!id) {
        // IF HAS NO ID SAVE, SHOW ASK ID MODAL
        setModalVisible(true)
      } else {
        // IF HAS, SET IT TO STATE
        const retrievedId = id.id;
        setMediaKitId(retrievedId);
      }
    } catch (err) {
      console.log("Failed retrieving media kit id.");
      console.log(err);
    }
  }, [getId, setMediaKitId])

  useEffect(() => {
    // IF NO MEDIA ID SET ON STATE, GET IT TO LOCAL DATABASE
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
            {!isCorrectInput && isInputTouched && <Text style={styles.errorMessage}>{inputErrorMessage}</Text>}
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
  errorMessage: {
    color: "red",
    marginTop: 15
  }
});