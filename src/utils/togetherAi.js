import { getExpenses } from "../configurations/expenses/expensesDatabase";

/**
 * Procesa un texto dado utilizando la API de Together AI y devuelve un JSON.
 *
 * @param {string} textToProcess - El texto que se enviará a la API para su procesamiento.
 * @returns {Promise<object | null>} Una promesa que resuelve con el objeto JSON procesado
 * o null si hay un error o no se encuentra JSON.
 */
export async function processTextWithTogetherAI(textToProcess) {
  const apiKey = 'a5797b44da5f6008663acc44ebc93aaa37ed486a3af98982360e78a0ca89d958'; // ¡Considera manejar esto de forma más segura!

  // Define el contenido del mensaje para la API

  const expensesCategories = await getExpenses();
  const expenses = expensesCategories.map(i => i.name).join(', ');

  const content =
    'Crea un json del tipo {category,detail,amount} ' +
    `Las categorias pueden ser: ${expenses} ` +
    'Si no estás seguro de los datos del json, mándalos como null. ' +
    'Si hay un valor del tipo 20 con 50, con significa separador de decimales ' +
    `El texto que quiero que proceses es: ${textToProcess}`;

  console.log('Content to send:', content);

  try {
    const res = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
        messages: [
          {
            role: 'user',
            content: content,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`HTTP error! status: ${res.status}, details: ${JSON.stringify(errorData)}`);
    }

    const data = await res.json();
    let contentResponse = data?.choices?.[0]?.message?.content || 'No response';

    const match = contentResponse.match(/```json([\s\S]*?)```/);
    if (match) {
      const jsonText = match[1].trim();
      try {
        const obj = JSON.parse(jsonText);
        console.log(' JSON extracted:', obj);
        return obj; // Retorna el objeto JSON parseado
      } catch (e) {
        console.error('❌ Error parsing JSON:', e.message);
        return null; // Si el JSON no es válido, retorna null
      }
    } else {
      console.warn('⚠️ No JSON found in the response.', contentResponse);
      return null; // Si no se encuentra JSON, retorna null
    }
  } catch (error) {
    console.error('Error in processTextWithTogetherAI:', error);
    return null; // En caso de cualquier error, retorna null
  }
}