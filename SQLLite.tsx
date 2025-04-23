import React, {useEffect} from 'react';
import {View, Button, Alert} from 'react-native';
import {
  initDB,
  insertItem,
  fetchItems,
  updateItem,
  deleteItem,
} from './utils/sqliteUtil';

export default function SQLLite() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <View style={{padding: 20}}>
      <Button title="Insertar" onPress={() => insertItem('Nuevo elemento')} />
      <Button
        title="Consultar"
        onPress={async () => {
          const items = await fetchItems();
          Alert.alert('Items', JSON.stringify(items));
        }}
      />
      <Button
        title="Actualizar ID=1"
        onPress={() => updateItem(1, 'Actualizado')}
      />
      <Button title="Eliminar ID=1" onPress={() => deleteItem(1)} />
    </View>
  );
}
