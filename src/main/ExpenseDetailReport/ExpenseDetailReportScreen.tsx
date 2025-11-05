import React, {useCallback, useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  // You don't need ScrollView anymore for this layout
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {
  addExpenseDetail,
  getExpensesDetail,
  updateExpenseDetail,
  deleteExpenseDetail,
} from './expenseDetailDatabase';
import {useFocusEffect} from '@react-navigation/native';
import {getExpenses} from '../../configurations/expenses/expensesDatabase';

import {commonStyles} from '../../../styles/commonStyles';
// You might not need ScrollView from gesture-handler either
import {formatDate} from '../../utils/utils';
import {exportExcelAndShare} from '../../utils/xls';
import ExpenseFormModal from './ExpenseFormModal';
import ActionModal from './ActionModal';

export default function ExpenseDetailReportScreen() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState('');
  const [description, setDescription] = useState('');
  const [expenseType, setExpenseType] = useState('');
  const [total, setTotal] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filterStartDate, setFilterStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [filterEndDate, setFilterEndDate] = useState(new Date());
  const [filterExpenseType, setFilterExpenseType] = useState<string | null>(null);
  const [expenseTypes, setExpenseTypes] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const isClosingPicker = useRef(false);

  useEffect(() => {
    // Cargar tipos de gastos disponibles
    getExpenses().then(items => {
      const types = items.map(item => item.name);
      setExpenseTypes(types);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Reinicia el formulario de entrada
      resetForm();

      // Reinicia los filtros de fecha al mes actual
      const today = new Date();
      setFilterStartDate(today);
      setFilterEndDate(today);
      setFilterExpenseType(null);

      // Carga los datos con los filtros reiniciados
      const loadInitialData = async () => {
        const data = await getExpensesDetail(today, today, null);
        setExpenses(data);
      };

      loadInitialData();
    }, []),
  );

  const loadExpenses = async () => {
    const data = await getExpensesDetail(filterStartDate, filterEndDate, filterExpenseType ?? undefined as any);
    setExpenses(data);
  };

  const handleSave = async () => {
    if (!description || !expenseType || !total) {return;}

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
    setIsFormModalVisible(false); // Close form modal on save
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    // Convertir 'YYYY-MM-DD' a Date local sin desfase
    if (item.date) {
      const [year, month, day] = item.date.split('-').map(Number);
      setDate(new Date(year, month - 1, day));
    } else {
      setDate(new Date());
    }
    setDescription(item.description);
    setExpenseType(item.expense_type);
    setTotal(parseFloat(item.total).toFixed(2));
    setIsActionModalVisible(false); // Close action modal
    setIsFormModalVisible(true); // Open form modal
  };

  const handleAddNew = () => {
    resetForm();
    setIsFormModalVisible(true);
  };

  const handleRowPress = (item: any) => {
    setSelectedItem(item);
    setIsActionModalVisible(true);
  };

  const handleDelete = (id: any) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este registro?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            await deleteExpenseDetail(id);
            await loadExpenses();
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const handleFilter = async () => {
    const all = await getExpensesDetail(filterStartDate, filterEndDate, filterExpenseType ?? undefined as any);
    setExpenses(all);
  };

  const handleDownloadExcel = async () => {
    const expensesDetail = await getExpensesDetail(
      filterStartDate,
      filterEndDate,
      filterExpenseType ?? undefined as any,
    );
    exportExcelAndShare(
      expensesDetail.map(e => ({
        fecha: e.date,
        tipo: e.expense_type,
        descripcion: e.description,
        total: e.total,
      })),
    );
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

  let totalAmount = expenses
    .reduce((sum, item) => sum + parseFloat(item.total), 0)
    .toFixed(2);

  // This function will render ONLY the table header
  const renderTableHeader = useCallback(
    () => (
      <View>
        {/* List Header */}
        <Text style={[commonStyles.title, {fontSize: 20, marginTop: 30}]}>
          Lista de gastos
        </Text>

        <View style={commonStyles.tableRow}>
          <Text style={[commonStyles.title, {fontSize: 20}]}>
            Total: ${totalAmount}
          </Text>
        </View>

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
            style={[
              commonStyles.tableCell,
              commonStyles.headerCell,
              {flex: 2},
            ]}>
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
            style={[
              commonStyles.tableCell,
              commonStyles.headerCell,
              {flex: 1},
            ]}>
            Total
          </Text>
        </View>
      </View>
    ),
    [totalAmount],
  );

  // Agrupa los valores y los manejadores en objetos
  const formValues = {
    editingId,
    date,
    description,
    expenseType,
    total,
  };

  const formHandlers = {
    setDescription,
    setExpenseType,
    setTotal,
    onSave: handleSave,
    setShowDatePicker,
  };

  return (
    <View style={commonStyles.container}>
      <ActionModal
        visible={isActionModalVisible}
        onClose={() => setIsActionModalVisible(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        selectedItem={selectedItem}
      />
      <ExpenseFormModal
        visible={isFormModalVisible}
        onClose={() => setIsFormModalVisible(false)}
        values={formValues}
        handlers={formHandlers}
      />

      {showDatePicker && !isClosingPicker.current && (
        <DateTimePicker
          value={dateDatePicker}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            // Guardar el tipo de picker antes de cerrarlo
            const pickerType = showDatePicker;
            
            // Marcar que estamos cerrando el picker para evitar re-abrirlo
            isClosingPicker.current = true;
            
            // Cerrar el picker primero para evitar que se vuelva a abrir
            setShowDatePicker('');
            
            // Solo actualizar si hay una fecha seleccionada y no fue cancelado
            if (selectedDate && event.type !== 'dismissed') {
              if (pickerType === 'date') {
                setDate(selectedDate);
              } else if (pickerType === 'start') {
                setFilterStartDate(selectedDate);
              } else if (pickerType === 'end') {
                setFilterEndDate(selectedDate);
              }
            }
            
            // Resetear el flag después de un pequeño delay
            setTimeout(() => {
              isClosingPicker.current = false;
            }, 100);
          }}
        />
      )}

      <FlatList
        // The contentContainerStyle from your ScrollView can be applied here
        contentContainerStyle={{paddingBottom: 20}}
        data={expenses}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <>
            <Text style={[commonStyles.title, {fontSize: 20, marginTop: 10}]}>
              Filtrar por fecha
            </Text>

            <View style={{flexDirection: 'row', gap: 10, marginVertical: 10}}>
              <Button
                title={filterStartDate ? (formatDate(filterStartDate) || 'Inicio') : 'Inicio'}
                onPress={() => {
                  isClosingPicker.current = false;
                  setShowDatePicker('start');
                }}
              />
              <Button
                title={filterEndDate ? (formatDate(filterEndDate) || 'Fin') : 'Fin'}
                onPress={() => {
                  isClosingPicker.current = false;
                  setShowDatePicker('end');
                }}
              />
            </View>

            <Text style={[commonStyles.itemText, {marginTop: 10}]}>
              Tipo de gasto:
            </Text>
            <View style={commonStyles.pickerContainer}>
              <Picker
                selectedValue={filterExpenseType}
                onValueChange={setFilterExpenseType}
                style={{color: 'black'}}>
                <Picker.Item
                  label="Todos los tipos"
                  value={null}
                  style={{color: 'grey'}}
                />
                {expenseTypes.map(type => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>

            <Button title="Consultar" onPress={handleFilter} />
            <View style={{marginVertical: 5}} />
            <Button title="Agregar Gasto" onPress={handleAddNew} />
            <View style={{marginVertical: 5}} />
            <Button title="Descargar excel" onPress={handleDownloadExcel} />

            {renderTableHeader()}
          </>
        }
        ListEmptyComponent={
          <Text style={commonStyles.emptyText}>No hay registros</Text>
        }
        renderItem={({item, index}) => (
          <TouchableOpacity onPress={() => handleRowPress(item)}>
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
                ${parseFloat(item.total).toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          expenses.length > 0 ? (
            <View style={[commonStyles.tableRow, {backgroundColor: '#e6e6e6'}]}>
              <Text style={[commonStyles.tableCell, {flex: 1.2}]} />
              <Text
                style={[commonStyles.tableCell, {flex: 2, fontWeight: 'bold'}]}>
                Total
              </Text>
              <Text style={[commonStyles.tableCell, {flex: 1.5}]} />
              <Text
                style={[commonStyles.tableCell, {flex: 1, fontWeight: 'bold'}]}>
                $
                {expenses
                  .reduce((sum, item) => sum + parseFloat(item.total), 0)
                  .toFixed(2)}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
