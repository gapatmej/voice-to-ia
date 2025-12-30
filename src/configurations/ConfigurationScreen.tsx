import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  getConfiguration,
  updateConfiguration,
  KEY_TOGETHER_AI_MODEL,
} from './configurationsDatabase';

export default function ConfigurationScreen() {
  const [model, setModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    setLoading(true);
    const storedModel = await getConfiguration(KEY_TOGETHER_AI_MODEL);
    if (storedModel) {
      setModel(storedModel);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!model.trim()) {
      Alert.alert('Error', 'El modelo no puede estar vacío');
      return;
    }

    setSaving(true);
    const result = await updateConfiguration(KEY_TOGETHER_AI_MODEL, model.trim());
    setSaving(false);

    if (result.success) {
      Alert.alert('Éxito', 'Configuración guardada correctamente');
    } else {
      Alert.alert('Error', 'No se pudo guardar la configuración');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuraciones</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Modelo Together AI:</Text>
        <TextInput
          style={styles.input}
          value={model}
          onChangeText={setModel}
          placeholder="Ej: deepseek-ai/DeepSeek-R1-Distill-Llama-70B"
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.saveButtonText}>Guardar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

