import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("aircast.db");

export const getId = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM mediakit",
        [],
        (_, result) => {
          resolve(result.rows._array[0]);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
}

export const setId = (id) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO mediakit (id) VALUES (?)",
        [id],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
}

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS mediakit (id VARCHAR(8) NOT NULL);",
        [],
        () => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS playlist (id INTEGER PRIMARY KEY NOT NULL, playlist VARCHAR(20000) NOT NULL);",
            [],
            () => {
              resolve();
            },
            (_, err) => {
              reject(err);
            }
          );
        },
        (_, err) => {
          reject(err);
        }
      );

    });
  });
  return promise;
};

export const insertPlaylist = (playlist) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO playlist (playlist) VALUES (?)",
        [playlist],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const getPlaylist = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM playlist ORDER BY id DESC",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};
