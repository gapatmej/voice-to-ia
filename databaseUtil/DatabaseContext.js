import React, { createContext, useContext, useEffect, useState } from 'react';
import SQLite from 'react-native-sqlite-storage';
import { TABLE_EXPENSES } from '../modules/configurations/expenses/expensesDatabase';

SQLite.enablePromise(true);

const database_name = "ExpensesDB.db";
const database_version = "1.0";
const database_displayname = "Expenses Database";
const database_size = 200000;

let db;

export async function initDB() {
  if (!db) {
    db = await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
  }

  await createExpenses();

  console.log("Base de datos inicializada correctamente");
}


async function createExpenses(){
  // Verificar si la tabla existe antes de crearla
  const result = await db.executeSql(`SELECT name FROM sqlite_master WHERE type='table' AND name='${TABLE_EXPENSES}';`);

  // Si no existe la tabla, entonces creamos la tabla
  if (result[0].rows.length === 0) {
    await db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${TABLE_EXPENSES} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL
        );`
      );
    });
    console.log("Tabla 'Expenses' creada correctamente.");
  } else {
    console.log("La tabla 'Expenses' ya existe.");
  }
}

export function getDB() {
  return db;
}

const DatabaseContext = createContext({
  db: null,
  isDBReady: false,
});

export function DatabaseProvider({ children }) {
  const [isDBReady, setIsDBReady] = useState(false);

  useEffect(() => {
    async function prepareDatabase() {
      try {
        await initDB();
        setIsDBReady(true);
      } catch (error) {
        console.error('Error inicializando base de datos:', error);
      }
    }

    prepareDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db: getDB(), isDBReady }}>
      {children}
    </DatabaseContext.Provider>
  );
}

// Hook para acceder fácilmente
export function useDatabase() {
  return useContext(DatabaseContext);
}