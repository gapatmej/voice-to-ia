import { getDB } from '../../databaseUtil/DatabaseContext';

export const TABLE_CONFIGURATIONS = "Configurations";
export const KEY_TOGETHER_AI_MODEL = "TOGETHER_AI_MODEL";

const db = getDB();

export async function getConfiguration(key) {
  try {
    const results = await db.executeSql(`SELECT value FROM ${TABLE_CONFIGURATIONS} WHERE key = ?;`, [key]);
    if (results[0].rows.length > 0) {
      return results[0].rows.item(0).value;
    }
    return null;
  } catch (error) {
    console.error(`Get Configuration Error (${key}):`, error);
    return null;
  }
}

export async function updateConfiguration(key, value) {
  try {
    await db.transaction(tx => {
      tx.executeSql(
        `INSERT OR REPLACE INTO ${TABLE_CONFIGURATIONS} (key, value) VALUES (?, ?);`,
        [key, value]
      );
    });
    return { success: true };
  } catch (error) {
    console.error(`Update Configuration Error (${key}):`, error);
    return { success: false, error };
  }
}

