import { getDB } from '../../../databaseUtil/DatabaseContext';

export const TABLE_EXPENSES = "Expenses";
const db = getDB();
export async function addExpense(name) {
  try {
    await db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO ${TABLE_EXPENSES} (name) VALUES (?);`,
        [name]
      );
    });
    return { success: true };
  } catch (error) {
    console.error("Add Expense Error:", error);
    return { success: false, error };
  }
}
export async function getExpenses() {
  try {
    const results = await db.executeSql(`SELECT * FROM ${TABLE_EXPENSES};`);
    let expenses = [];
    results.forEach(result => {
      for (let i = 0; i < result.rows.length; i++) {
        expenses.push(result.rows.item(i));
      }
    });
    return expenses;
  } catch (error) {
    console.error("Get Expenses Error:", error);
    return [];
  }
}

export async function updateExpense(id, newName) {
  try {
    await db.transaction(tx => {
      tx.executeSql(
        `UPDATE ${TABLE_EXPENSES} SET name = ? WHERE id = ?;`,
        [newName, id]
      );
    });
    return { success: true };
  } catch (error) {
    console.error("Update Expense Error:", error);
    return { success: false, error };
  }
}

export async function deleteExpense(id) {
  try {
    await db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM ${TABLE_EXPENSES} WHERE id = ?;`,
        [id]
      );
    });
    return { success: true };
  } catch (error) {
    console.error("Delete Expense Error:", error);
    return { success: false, error };
  }
}