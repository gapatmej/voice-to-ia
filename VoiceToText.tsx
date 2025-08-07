import React, {useState, useEffect} from 'react';
import {View, Button, PermissionsAndroid, Platform} from 'react-native';
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

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsRecognizing(true);
    };

    Voice.onSpeechEnd = () => {
      setIsRecognizing(false);
    };

    Voice.onSpeechResults = e => {
      onVoiceToText(e.value[0]);
      setIsRecognizing(false);
    };

    Voice.onSpeechError = e => {
      setError(e.error);
      setIsRecognizing(false);
    };

    // Limpieza cuando el componente se desmonte
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecognizing = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setError('Permiso de micrófono denegado');
      return;
    }

    try {
      await Voice.start('es-ES');
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop(); // Detener el reconocimiento
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button
        title={isRecognizing ? 'Detener' : 'Agregar gasto'}
        onPress={isRecognizing ? stopRecognizing : startRecognizing}
      />
    </View>
  );
};

export default VoiceToText;
