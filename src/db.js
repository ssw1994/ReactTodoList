let DB = (() => {
    const dbconfig = {
        name: 'tododb',
        version: 1,
        tables: [
            {
                name: "tbltodo",
                options: {
                    keyPath: 'id',
                    autoIncrement: true
                }
            }
        ]
    }
    let db, transaction = {};

    let updateDB = function (tblName, tblObj) {
        try {
            return new Promise((resolve, reject) => {
                if (db) {
                    dbconfig.tables.forEach((x) => {
                        transaction[x.name] = db.transaction([x.name], "readwrite").objectStore(x.name);
                    })
                    let tblStore = transaction[tblName].put(tblObj);
                    tblStore.onsuccess = () => {
                        resolve({ error: false, message: tblName + "Updated" })
                    }
                    tblStore.onerror = () => {
                        reject({ error: true, message: tblStore.error });
                    }
                } else {
                    reject({ error: true, message: "Db Not ready" })
                }

            })

        } catch (error) {
            console.error(error);
        }
    }

    let deleteDB = function (tblName, id) {
        try {
            return new Promise((resolve, reject) => {
                if (db) {
                    dbconfig.tables.forEach((x) => {
                        transaction[x.name] = db.transaction([x.name], "readwrite").objectStore(x.name);
                    })
                    let tblStore = transaction[tblName].delete(id);
                    tblStore.onsuccess = () => {
                        resolve({ error: false, message: tblName + "Deleted id" + id })
                    }
                    tblStore.onerror = () => {
                        reject({ error: true, message: tblStore.error });
                    }
                } else {
                    reject({ error: true, message: "Db not ready" });
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @author SSW
     * @description this function is used for fetching all the data
     */
    let getData = function (tblName) {
        try {
            return new Promise((resolve, reject) => {
                if (db) {
                    dbconfig.tables.forEach((x) => {
                        transaction[x.name] = db.transaction(x.name, "readwrite").objectStore(x.name);
                    });
                    let resultSet = [];
                    transaction[tblName].openCursor().onsuccess = function (event) {
                        var cursor = event.target.result;

                        if (cursor) {
                            resultSet.push(cursor.value)
                            cursor.continue();
                        } else {
                            if (resultSet)
                                resolve(resultSet);
                            else
                                reject({ error: "Error in fetching data" });
                        }
                    };
                } else {
                    reject({ error: true, message: "db not ready" });
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    let check = function () {
        return new Promise((resolve, reject) => {
            if (window.indexedDB)
                resolve();
            else
                reject();
        })
    }

    let deleteTable = function (tblName) {
        try {
            db.deleteObjectStore(tblName);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @author SSW
     * @description this function is used for creating table
     */
    let createTable = function (tblObj) {
        try {
            db.createObjectStore(tblObj.name, tblObj.options);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @author SSW
     * @descripton this function is used for initialization of indexeddb
     */
    let initDB = function () {
        try {
            check().then(
                (success) => {
                    let openRequest = indexedDB.open(dbconfig.name, dbconfig.version);
                    openRequest.onupgradeneeded = () => {
                        db = openRequest.result;
                        dbconfig.tables.forEach((x) => {
                            createTable(x);
                        });
                        console.log(transaction);
                    };
                    openRequest.onerror = () => {
                        alert("error");
                    };
                    openRequest.onsuccess = () => {
                        db = openRequest.result;
                        console.log(transaction);
                    }
                },
                (error) => {
                    alert("Sorry...Indexed db not supported");
                }
            );

        } catch (error) {
            console.error(error);
        }
    }

    initDB();

    return {
        updateDB,
        getData,
        deleteDB,
    }
})();

export default DB;