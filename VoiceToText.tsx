import React, {useState, useEffect} from 'react';
import {View, Text, Button, PermissionsAndroid, Platform} from 'react-native';
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
  onVoiceToText: () => string;
};

const VoiceToText = ({onVoiceToText}: VoiceToTextProps) => {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsRecognizing(true);
    };

    Voice.onSpeechEnd = () => {
      setIsRecognizing(false);
    };

    Voice.onSpeechResults = e => {
      //setRecognizedText(e.value[0]); // Tomamos el primer resultado
      onVoiceToText(e.value[0]);
    };

    Voice.onSpeechError = e => {
      setError(e.error);
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
      <Text>Voz a texto:</Text>
      <Text>{recognizedText}</Text>
      {error ? <Text style={{color: 'red'}}>{error}</Text> : null}
      <Button
        title={isRecognizing ? 'Detener' : 'Iniciar'}
        onPress={isRecognizing ? stopRecognizing : startRecognizing}
      />
    </View>
  );
};

export default VoiceToText;
