import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from './expensesDatabase';

export default function ExpenseScreen() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const loadExpenses = async () => {
    const data = await getExpenses();
    setExpenses(data);
  };

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

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={styles.editButton}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gastos</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nombre del gasto"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor='black'
        />
        <Button
          title={editingId ? 'Actualizar' : 'Agregar'}
          onPress={handleSave}
        />
      </View>

      <FlatList
        data={expenses}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay gastos registrados.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8D7DA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black', // Color global para todo el texto
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    color: 'black', // Color global para todo el texto
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 18,
    color: 'black', // Color global para todo el texto
  },
  buttons: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: 10,
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
});
