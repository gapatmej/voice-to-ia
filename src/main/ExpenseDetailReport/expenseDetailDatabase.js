import {getDB} from '../../../databaseUtil/DatabaseContext';

export const TABLE_EXPENSES_DETAIL = 'ExpensesDetail';

const db = getDB();
export async function addExpenseDetail(date, description, expenseType, total) {
  try {
    await db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO ${TABLE_EXPENSES_DETAIL} (date, description, expense_type, total) VALUES (?, ?, ?, ?);`,
        [date, description, expenseType, total],
      );
    });
    return {success: true};
  } catch (error) {
    console.error('Add Expense Detail Error:', error);
    return {success: false, error};
  }
}

export async function getExpensesDetail(fromDate, toDate) {
  try {
    fromDate = fromDate.toISOString().split('T')[0];
    toDate = toDate.toISOString().split('T')[0];

    const results = await db.executeSql(
      `SELECT * FROM ${TABLE_EXPENSES_DETAIL} WHERE date BETWEEN ? AND ? ORDER BY date ASC;`,
      [fromDate, toDate],
    );

 
    let expensesDetail = [];
    results.forEach(result => {
      for (let i = 0; i < result.rows.length; i++) {
        expensesDetail.push(result.rows.item(i));
      }
    });
    return expensesDetail;
  } catch (error) {
    console.error('Get Expenses Detail Error:', error);
    return [];
  }
}

export async function updateExpenseDetail(
  id,
  date,
  description,
  expenseType,
  total,
) {
  try {
    await db.transaction(tx => {
      tx.executeSql(
        `UPDATE ${TABLE_EXPENSES_DETAIL} SET date = ?, description = ?, expense_type = ?, total = ? WHERE id = ?;`,
        [date, description, expenseType, total, id],
      );
    });
    return {success: true};
  } catch (error) {
    console.error('Update Expense Detail Error:', error);
    return {success: false, error};
  }
}

export async function deleteExpenseDetail(id) {
  try {
    await db.transaction(tx => {
      tx.executeSql(`DELETE FROM ${TABLE_EXPENSES_DETAIL} WHERE id = ?;`, [id]);
    });
    return {success: true};
  } catch (error) {
    console.error('Delete Expense Detail Error:', error);
    return {success: false, error};
  }
}
