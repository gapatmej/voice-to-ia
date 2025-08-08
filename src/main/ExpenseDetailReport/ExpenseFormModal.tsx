import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import {commonStyles} from '../../../styles/commonStyles';
import {formatDate} from '../../utils/utils';

export default function ExpenseFormModal({
  visible,
  onClose,
  values,
  handlers,
}) {
  const {editingId, date, description, expenseType, total} = values;
  const {
    setDescription,
    setExpenseType,
    setTotal,
    onSave,
    setShowDatePicker,
  } = handlers;

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
          onPress={onSave}
        />
        <View style={{marginTop: 10}} />
        <Button title="Cancelar" color="grey" onPress={onClose} />
      </View>
    </Modal>
  );
}