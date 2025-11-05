import {getDB} from '../../../databaseUtil/DatabaseContext';
import {formatDate} from '../../utils/utils';

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

export async function getExpensesDetail(fromDate, toDate, expenseType = null) {
  try {
    fromDate = formatDate(fromDate) || '';
    toDate = formatDate(toDate) || '';

    if (!fromDate || !toDate) {
      console.error('Invalid dates provided to getExpensesDetail');
      return [];
    }

    let query = `SELECT * FROM ${TABLE_EXPENSES_DETAIL} WHERE date BETWEEN ? AND ?`;
    let params = [fromDate, toDate];

    if (expenseType) {
      query += ` AND expense_type = ?`;
      params.push(expenseType);
    }

    query += ` ORDER BY date ASC;`;

    const results = await db.executeSql(query, params);

 
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
