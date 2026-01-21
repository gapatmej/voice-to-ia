import React, {useState, useEffect} from 'react';
import {View, Button, PermissionsAndroid, Platform, Text} from 'react-native';
import Voice from '@react-native-voice/voice';

const requestMicrophonePermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Permiso para usar el micrófono',
        message: 'Necesitamos tu permiso para convertir voz en texto',
        buttonNeutral: 'Preguntar después',
        buttonNegative: 'Cancelar',
        buttonPositive: 'Aceptar',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

type VoiceToTextProps = {
  onVoiceToText: (text: string) => void;
};

const VoiceToText = ({onVoiceToText}: VoiceToTextProps) => {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [error, setError] = useState('');
  const [partialResults, setPartialResults] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsRecognizing(true);
      if (Platform.OS === 'ios') {
        setPartialResults('');
      }
    };

    Voice.onSpeechEnd = () => {
      // No detener automáticamente el reconocimiento en iOS
      // El usuario debe presionar el botón "Detener" manualmente
      if (Platform.OS === 'android') {
        setIsRecognizing(false);
      }
    };

    // Capturar resultados parciales mientras hablas
    Voice.onSpeechPartialResults = e => {
      if (e.value && e.value.length > 0) {
        setPartialResults(e.value[0]);
      }
    };

    Voice.onSpeechResults = e => {
      if (e.value && e.value.length > 0) {
        // En Android, procesar resultados finales
        if (Platform.OS === 'android') {
          onVoiceToText(e.value[0]);
          setIsRecognizing(false);
        }
        // En iOS con modo continuo, actualizar resultados parciales
        // El usuario debe presionar "Detener" para finalizar
      }
    };

    Voice.onSpeechError = e => {
      console.error('Speech error:', e);
      setError(e.error);
      setIsRecognizing(false);
    };

    // Limpieza cuando el componente se desmonte
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [onVoiceToText]);

  const startRecognizing = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setError('Permiso de micrófono denegado');
      return;
    }

    try {
      setError('');
      if (Platform.OS === 'ios') {
        setPartialResults('');
      }
      // Opciones para mejorar el reconocimiento continuo
      const options = {
        // Para iOS - no detener automáticamente
        continuous: true,
        // Esperar más tiempo antes de considerar que terminó de hablar
        interimResults: true,
      };
      await Voice.start('es-ES', options);
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
      // Procesar el texto capturado hasta ahora
      if (partialResults) {
        onVoiceToText(partialResults);
        setPartialResults('');
      }
      // Restablecer el estado
      setIsRecognizing(false);
    } catch (e) {
      console.error(e);
      setIsRecognizing(false);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {Platform.OS === 'ios' && partialResults ? (
        <Text style={{marginBottom: 10, color: '#666', fontStyle: 'italic', paddingHorizontal: 20, textAlign: 'center'}}>
          "{partialResults}"
        </Text>
      ) : null}
      <Button
        title={isRecognizing ? 'Detener' : 'Agregar gasto'}
        onPress={isRecognizing ? stopRecognizing : startRecognizing}
      />
      {error ? <Text style={{color: 'red', marginTop: 10}}>{error}</Text> : null}
    </View>
  );
};

export default VoiceToText;
