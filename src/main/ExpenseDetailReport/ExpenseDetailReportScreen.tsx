import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  addExpenseDetail,
  getExpensesDetail,
  updateExpenseDetail,
  deleteExpenseDetail,
} from './expenseDetailDatabase';
import Icon from 'react-native-vector-icons/MaterialIcons'; // o FontAwesome, Ionicons, etc.

import {commonStyles} from '../../../styles/commonStyles';
import {ScrollView} from 'react-native-gesture-handler';
import {formatDate} from '../../utils/utils';

export default function ExpenseDetailReportScreen() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState('');
  const [description, setDescription] = useState('');
  const [expenseType, setExpenseType] = useState('');
  const [total, setTotal] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filterStartDate, setFilterStartDate] = useState(new Date());
  const [filterEndDate, setFilterEndDate] = useState(new Date());
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    console.log("aa",filterStartDate, filterEndDate);
    const data = await getExpensesDetail(filterStartDate, filterEndDate);
    setExpenses(data);
  };

  const handleSave = async () => {
    if (!description || !expenseType || !total) return;

    if (editingId !== null) {
      await updateExpenseDetail(
        editingId,
        formatDate(date),
        description,
        expenseType,
        parseFloat(total),
      );
    } else {
      await addExpenseDetail(
        formatDate(date),
        description,
        expenseType,
        parseFloat(total),
      );
    }

    resetForm();
    await loadExpenses();
  };

  const handleEdit = item => {
    setEditingId(item.id);
    setDate(new Date(item.date));
    setDescription(item.description);
    setExpenseType(item.expense_type);
    setTotal(item.total.toString());
  };

  const handleDelete = async id => {
    await deleteExpenseDetail(id);
    await loadExpenses();
  };

  const handleFilter = async () => {
    const all = await getExpensesDetail(filterStartDate, filterEndDate);
    setExpenses(all);
  };

  const resetForm = () => {
    setDate(new Date());
    setDescription('');
    setExpenseType('');
    setTotal('');
    setEditingId(null);
  };

  let dateDatePicker = date;
  if (showDatePicker === 'start') {
    dateDatePicker = filterStartDate;
  } else if (showDatePicker === 'end') {
    dateDatePicker = filterEndDate;
  }

  return (
    <ScrollView contentContainerStyle={commonStyles.scrollContainer}>
      {/* Form Area */}
      <Text style={commonStyles.title}>Gestor de Gastos3</Text>

      <Text style={commonStyles.itemText}>Fecha:</Text>
      <TouchableOpacity
        style={commonStyles.input}
        onPress={() => setShowDatePicker('date')}>
        <Text style={commonStyles.dateText}>{formatDate(date)}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dateDatePicker}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            if (selectedDate) {
              if (showDatePicker === 'date') {
                setDate(selectedDate);
              }
              if (showDatePicker === 'start') {
                setFilterStartDate(selectedDate);
              }
              if (showDatePicker === 'end') {
                setFilterEndDate(selectedDate);
              }
            }
            setShowDatePicker('');
          }}
        />
      )}

      <TextInput
        style={commonStyles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción"
        placeholderTextColor="#777"
      />

      <TextInput
        style={commonStyles.input}
        value={expenseType}
        onChangeText={setExpenseType}
        placeholder="Tipo de gasto"
        placeholderTextColor="#777"
      />

      <TextInput
        style={commonStyles.input}
        value={total}
        onChangeText={setTotal}
        placeholder="Total"
        keyboardType="numeric"
        placeholderTextColor="#777"
      />

      <Button
        title={editingId !== null ? 'Actualizar' : 'Guardar'}
        onPress={handleSave}
      />

      <Text style={[commonStyles.title, {fontSize: 20, marginTop: 30}]}>
        Filtrar por fecha
      </Text>

      <View style={commonStyles.dateRow}>
        <Button
          title={filterStartDate ? formatDate(filterStartDate) : 'Inicio'}
          onPress={() => setShowDatePicker('start')}
        />
        <Button
          title={filterEndDate ? formatDate(filterEndDate) : 'Fin'}
          onPress={() => setShowDatePicker('end')}
        />
      </View>

      <Button title="Consultar" onPress={handleFilter} />

      {/* List of Expenses */}
      <Text style={[commonStyles.title, {fontSize: 20, marginTop: 30}]}>
        Lista de gastos
      </Text>

      <View style={commonStyles.tableHeader}>
        <Text
          style={[
            commonStyles.tableCell,
            commonStyles.headerCell,
            {flex: 1.2},
          ]}>
          Fecha
        </Text>
        <Text
          style={[commonStyles.tableCell, commonStyles.headerCell, {flex: 2}]}>
          Descripción
        </Text>
        <Text
          style={[
            commonStyles.tableCell,
            commonStyles.headerCell,
            {flex: 1.5},
          ]}>
          Tipo
        </Text>
        <Text
          style={[commonStyles.tableCell, commonStyles.headerCell, {flex: 1}]}>
          Total
        </Text>
        <Text
          style={[
            commonStyles.tableCell,
            commonStyles.headerCell,
            {flex: 1.5},
          ]}>
          Acciones
        </Text>
      </View>

      {expenses.length === 0 ? (
        <Text style={commonStyles.emptyText}>No hay registros</Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={item => item.id.toString()}
          renderItem={({item, index}) => (
            <View
              style={[
                commonStyles.tableRow,
                {backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff'},
              ]}>
              <Text style={[commonStyles.tableCell, {flex: 1.2}]}>
                {item.date}
              </Text>
              <Text style={[commonStyles.tableCell, {flex: 2}]}>
                {item.description}
              </Text>
              <Text style={[commonStyles.tableCell, {flex: 1.5}]}>
                {item.expense_type}
              </Text>
              <Text style={[commonStyles.tableCell, {flex: 1}]}>
                ${item.total}
              </Text>
              <View
                style={[
                  commonStyles.tableCell,
                  {flex: 1.5, flexDirection: 'row'},
                ]}>
                <TouchableOpacity
                  style={commonStyles.editButton}
                  onPress={() => handleEdit(item)}>
                  <Icon name="edit" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={commonStyles.deleteButton}
                  onPress={() => handleDelete(item.id)}>
                  <Icon name="delete" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}
