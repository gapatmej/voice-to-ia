import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import VoiceToText from '../../VoiceToText';
import {processTextWithTogetherAI} from '../utils/togetherAi';
import {addExpenseDetail} from './ExpenseDetailReport/expenseDetailDatabase';
import {formatDate} from '../utils/utils';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState({
    voiceText: '',
    aiResult: '',
    error: '',
  });

  const handleOnVoiceToText = async (text: any) => {
    setLoading(true);
    setLogs({ voiceText: text, aiResult: '', error: '' });
    try {
      const jsonExpenseDetail = await processTextWithTogetherAI(text);
      setLogs(prev => ({ ...prev, aiResult: JSON.stringify(jsonExpenseDetail, null, 2) }));
      if (jsonExpenseDetail) {
        await addExpenseDetail(
          formatDate(new Date()),
          jsonExpenseDetail.detail ?? '',
          jsonExpenseDetail.category,
          parseFloat(jsonExpenseDetail.amount),
        );
      }
    } catch (error) {
      console.error('Error al procesar texto o guardar gasto:', error);
      setLogs(prev => ({ ...prev, error: String(error) }));
      Alert.alert('Error', 'Ocurrió un error al procesar el texto o guardar el gasto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agrega un gasto</Text>
      <VoiceToText onVoiceToText={handleOnVoiceToText} />

      {/* Logs visuales */}
      <View style={styles.logBox}>
        <Text style={styles.logTitle}>Logs</Text>
        <Text style={styles.logLabel}>Texto de voz:</Text>
        <Text style={styles.logText}>{logs.voiceText}</Text>
        <Text style={styles.logLabel}>Resultado AI:</Text>
        <Text style={styles.logText}>{logs.aiResult}</Text>
        {logs.error ? (
          <>
            <Text style={styles.logLabel}>Error:</Text>
            <Text style={[styles.logText, { color: 'red' }]}>{logs.error}</Text>
          </>
        ) : null}
      </View>

      {loading && (
        <TouchableWithoutFeedback>
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Procesando...</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  logTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  logLabel: {
    fontWeight: 'bold',
    marginTop: 6,
    color: '#555',
  },
  logText: {
    fontSize: 14,
    color: '#222',
    marginBottom: 4,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // asegúrate de que esté encima de todo
    elevation: 10, // para Android
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
  },
});
