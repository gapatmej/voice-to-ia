import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';

type TogetherAIProps = {
  textToProccess: string;
};

export default function TogetherAI({textToProccess}: TogetherAIProps) {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = useCallback(async () => {
    setLoading(true);

    try {
      const content = 'Crea un json del tipo {categoria,detalle,monto, operacion}. ' +
      'Las categorias pueden ser: Gastos restaurantes, gastos alimentación, gastos golosinas, gastos bebidas. ' +
      'Los tipos de operación pueden ser suma o resta. Si no estás seguro de los datos del json, mándalos como null. ' +
      'Si hay un valor del tipo 20 con 50, con significa separador de decimales' +
      `El texto que quiero que proceses es: ${textToProccess}`;
      console.log("content to send", content);
      const res = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization:
            'Bearer a5797b44da5f6008663acc44ebc93aaa37ed486a3af98982360e78a0ca89d958',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
          messages: [
            {
              role: 'user',
              content,
            },
          ],
        }),
      });

      const data = await res.json();
      let contentResponse = data?.choices?.[0]?.message?.content || 'No response';

      const match = contentResponse.match(/```json([\s\S]*?)```/);
      if (match) {
        const jsonText = match[1].trim();
        try {
          const obj = JSON.parse(jsonText);
          console.log('✅ JSON extraído:', obj);
          contentResponse = JSON.stringify(obj, null, 2);
        } catch (e) {
          console.error('❌ Error al parsear el JSON:', e.message);
        }
      } else {
        console.warn('⚠️ No se encontró JSON en el texto.',contentResponse);
      }

      setResponse(contentResponse);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Hubo un error al conectar con Together AI.');
    }

    setLoading(false);
  }, [textToProccess]);

  // 👉 Se ejecuta cuando cambia textToProccess
  useEffect(() => {
    if (textToProccess && textToProccess.trim() !== '') {
      handleAsk();
    }
  }, [textToProccess, handleAsk]);

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{marginVertical: 10}}
        />
      )}

      <ScrollView style={styles.responseBox}>
        <Text style={styles.responseText}>{response}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 32,
    backgroundColor: '#fff',
  },
  responseBox: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    maxHeight: 300,
  },
  responseText: {
    fontFamily: 'Courier',
    fontSize: 14,
    color: '#333',
  },
});
