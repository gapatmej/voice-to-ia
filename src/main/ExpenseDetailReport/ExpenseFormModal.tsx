import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getExpenses } from '../../configurations/expenses/expensesDatabase';
import {commonStyles} from '../../../styles/commonStyles';
import {formatDate} from '../../utils/utils';


export default function ExpenseFormModal({
  visible,
  onClose,
  values,
  handlers,
}) {
  const { editingId, date, description, expenseType, total } = values;
  const {
    setDescription,
    setExpenseType,
    setTotal,
    onSave,
    setShowDatePicker,
  } = handlers;

  const [expenseTypes, setExpenseTypes] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      // Si es nuevo gasto, reinicia el tipo de gasto a blanco
      if (!editingId) {
        setExpenseType('');
      }
      getExpenses().then(items => {
        const types = items.map(item => item.name);
        setExpenseTypes(types);
        // Si no hay tipo seleccionado y hay tipos disponibles, selecciona el primero
        // Solo para edición, no para nuevo gasto
        if (editingId && !expenseType && types.length > 0) {
          setExpenseType(types[0]);
        }
      });
    }
  }, [visible, editingId]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>
          {editingId ? 'Editar Gasto' : 'Agregar Gasto'}
        </Text>

        <Text style={commonStyles.itemText}>Fecha:</Text>
        <TouchableOpacity
          style={commonStyles.input}
          onPress={() => setShowDatePicker('date')}>
          <Text style={commonStyles.dateText}>{formatDate(date)}</Text>
        </TouchableOpacity>

        <TextInput
          style={[commonStyles.input, { height: 80, textAlignVertical: 'top' }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción"
          placeholderTextColor="#777"
          multiline
          numberOfLines={4}
        />

        <View style={commonStyles.input}>
          <Picker
            selectedValue={expenseType}
            onValueChange={setExpenseType}
          >
            <Picker.Item label="Selecciona tipo de gasto" value="" />
            {expenseTypes.map((type, idx) => (
              <Picker.Item key={idx} label={type} value={type} />
            ))}
          </Picker>
        </View>

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
          onPress={onSave}
        />
  <View style={commonStyles.marginTop10} />
        <Button title="Cancelar" color="grey" onPress={onClose} />
      </View>
    </Modal>
  );
}
