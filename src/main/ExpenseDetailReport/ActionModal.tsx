import React from 'react';
import {Modal, View, Text, Button, TouchableOpacity, StyleSheet} from 'react-native';

export default function ActionModal({
  visible,
  onClose,
  onEdit,
  onDelete,
  selectedItem,
}) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Acciones</Text>
          <Button
            title="Editar"
            onPress={() => {
              if (selectedItem) onEdit(selectedItem);
              onClose();
            }}
          />
          <View style={{marginVertical: 5}} />
          <Button
            title="Eliminar"
            color="red"
            onPress={() => {
              if (selectedItem) onDelete(selectedItem.id);
              onClose();
            }}
          />
          <View style={{marginVertical: 5}} />
          <Button title="Cancelar" color="grey" onPress={onClose} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
});