import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db;

/**
 * Inicializa la base de datos y crea la tabla si no existe.
 */
export const initDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: 'mydb.db', location: 'default' });
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      );
    `);
    console.log('[DB] Tabla inicializada');
  } catch (error) {
    console.error('[DB] Error al inicializar:', error);
    throw error;
  }
};

/**
 * Inserta un nuevo item en la base de datos.
 * @param {string} name Nombre del item a insertar.
 */
export const insertItem = async (name) => {
  try {
    await db.executeSql('INSERT INTO items (name) VALUES (?);', [name]);
    console.log('[DB] Item insertado:', name);
  } catch (error) {
    console.error('[DB] Error al insertar:', error);
    throw error;
  }
};

/**
 * Consulta todos los items de la base de datos.
 * @returns {Promise<Array>} Lista de items.
 */
export const fetchItems = async () => {
  try {
    const [results] = await db.executeSql('SELECT * FROM items;');
    const items = [];

    for (let i = 0; i < results.rows.length; i++) {
      items.push(results.rows.item(i));
    }

    console.log('[DB] Items consultados:', items);
    return items;
  } catch (error) {
    console.error('[DB] Error al consultar:', error);
    throw error;
  }
};

/**
 * Actualiza el nombre de un item por ID.
 * @param {number} id ID del item.
 * @param {string} newName Nuevo nombre.
 */
export const updateItem = async (id, newName) => {
  try {
    await db.executeSql('UPDATE items SET name = ? WHERE id = ?;', [newName, id]);
    console.log(`[DB] Item ${id} actualizado a "${newName}"`);
  } catch (error) {
    console.error('[DB] Error al actualizar:', error);
    throw error;
  }
};

/**
 * Elimina un item por ID.
 * @param {number} id ID del item a eliminar.
 */
export const deleteItem = async (id) => {
  try {
    await db.executeSql('DELETE FROM items WHERE id = ?;', [id]);
    console.log(`[DB] Item ${id} eliminado`);
  } catch (error) {
    console.error('[DB] Error al eliminar:', error);
    throw error;
  }
};