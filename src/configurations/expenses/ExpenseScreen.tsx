import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from './expensesDatabase';
import {commonStyles} from '../../../styles/commonStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ExpenseScreen() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const loadExpenses = async () => {
    const data = await getExpenses();
    setExpenses(data);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío.');
      return;
    }

    if (editingId !== null) {
      const result = await updateExpense(editingId, name);
      if (!result.success) {
        Alert.alert(
          'Error',
          'No se pudo actualizar el gasto. ¿Nombre duplicado?',
        );
      }
    } else {
      const result = await addExpense(name);
      if (!result.success) {
        Alert.alert('Error', 'No se pudo agregar el gasto. ¿Nombre duplicado?');
      }
    }

    setName('');
    setEditingId(null);
    await loadExpenses();
  };

  const handleEdit = expense => {
    setName(expense.name);
    setEditingId(expense.id);
  };

  const handleDelete = id => {
    Alert.alert('Confirmar', '¿Estás seguro que quieres eliminar este gasto?', [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteExpense(id);
          await loadExpenses();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Ensure this container View takes up all available space */}
      <View style={[commonStyles.container, {flex: 1}]}>
        <Text style={commonStyles.title}>Gastos</Text>

        <View style={commonStyles.inputContainer}>
          <TextInput
            placeholder="Nombre del gasto"
            value={name}
            onChangeText={setName}
            style={commonStyles.input}
            placeholderTextColor="black"
          />
          <Button
            title={editingId ? 'Actualizar' : 'Agregar'}
            onPress={handleSave}
          />
        </View>

        {/* This ScrollView will now expand correctly within its flex parent */}
        <ScrollView>
          {expenses.map(item => (
            <View key={item.id.toString()} style={commonStyles.itemContainer}>
              <Text style={commonStyles.itemText}>{item.name}</Text>
              <View style={commonStyles.buttons}>
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  style={commonStyles.editButton}>
                  <Icon name="edit" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={commonStyles.deleteButton}>
                  <Icon name="delete" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {expenses.length === 0 && (
            <Text style={commonStyles.emptyText}>
              No hay gastos registrados.
            </Text>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
