import React, { createContext, useContext, useEffect, useState } from 'react';
import SQLite from 'react-native-sqlite-storage';
import { TABLE_EXPENSES } from '../src/configurations/expenses/expensesDatabase';
import { TABLE_EXPENSES_DETAIL } from '../src/main/ExpenseDetailReport/expenseDetailDatabase';

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
  await createExpensesDetail();

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
    
    // Agregar registros por defecto
    await insertDefaultExpenses();
  } else {
    console.log("La tabla 'Expenses' ya existe.");
  }
}

async function insertDefaultExpenses() {
  const defaultExpenses = [
    'Restaurantes',
    'Ocio',
    'Golosinas',
    'Salud',
    'Vestimenta',
    'Educacion',
    'Alimentacion diaria',
  ];

  try {
    await db.transaction(tx => {
      defaultExpenses.forEach(expense => {
        tx.executeSql(
          `INSERT OR IGNORE INTO ${TABLE_EXPENSES} (name) VALUES (?);`,
          [expense]
        );
      });
    });
    console.log('Registros por defecto agregados a la tabla \'Expenses\'.');
  } catch (error) {
    console.error('Error al agregar registros por defecto:', error);
  }
}

async function createExpensesDetail(){
  // Verificar si la tabla existe antes de crearla
  const result = await db.executeSql(`SELECT name FROM sqlite_master WHERE type='table' AND name='${TABLE_EXPENSES_DETAIL}';`);

  // Si no existe la tabla, entonces creamos la tabla
  if (result[0].rows.length === 0) {
    await db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${TABLE_EXPENSES_DETAIL} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
              date TEXT NOT NULL, -- formato sugerido: 'YYYY-MM-DD'
              description TEXT NOT NULL,
              expense_type TEXT NOT NULL,
              total REAL NOT NULL
        );`
      );
    });
    console.log("Tabla 'Expenses Detail' creada correctamente.");
  } else {
    console.log("La tabla 'Expenses Detail' ya existe.");
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