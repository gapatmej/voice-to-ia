// src/styles/commonStyles.js
import {StyleSheet} from 'react-native';

export const commonStyles = StyleSheet.create({
  marginTop10: {
    marginTop: 10,
  },
  container: {
    padding: 20, // Espacio interior del contenedor
    backgroundColor: '#F8F8F8', // Un color de fondo claro para el contenedor
    justifyContent: 'flex-start', // Alinea el contenido desde la parte superior
    // No uses flex: 1 aquí
  },
  title: {
    fontSize: 26, // Aumentamos el tamaño de la fuente
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black', // Cambiado a color negro
  },
  input: {
    borderWidth: 1, // Establece un borde visible
    borderColor: '#aaa', // Color del borde por defecto
    paddingVertical: 10, // Ajusta solo el padding vertical (arriba y abajo)
    paddingHorizontal: 15, // Ajusta el padding horizontal (izquierda y derecha)
    marginRight: 10, // Espaciado derecho
    borderRadius: 5, // Bordes redondeados
    color: 'black', // Color del texto
    backgroundColor: '#fff', // Fondo blanco
    fontSize: 16, // Asegura un tamaño de texto adecuado
    height: 50,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginRight: 10,
    justifyContent: 'center', // Centra el Picker verticalmente
  },
  itemText: {
    fontSize: 20, // Aumentamos el tamaño de la fuente
    color: 'black', // Cambiado a color negro
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  dateText: {
    color: 'black', // Asegura que el texto sea negro
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
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
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#444',
    padding: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  tableCell: {
    paddingHorizontal: 4,
    fontSize: 14,
    color: 'black',
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
