import * as FileSystem from "expo-file-system";

export const initContentsFolder = () => {
  const promise = new Promise((resolve, reject) => {
    FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}contents/`)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
  return promise;
};

export const downloadContent = (link, fileName) => {
  const promise = new Promise((resolve, reject) => {
    FileSystem.downloadAsync(
      link,
      `${FileSystem.documentDirectory}contents/${fileName}`
    )
      .then(({ uri }) => {
        // console.log("Finished downloading to ", uri);
        resolve(uri);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
  return promise;
};
