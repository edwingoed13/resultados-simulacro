const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Solo aceptar GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Método no permitido'
      })
    };
  }

  try {
    // Obtener DNI de los query parameters
    const dni = event.queryStringParameters?.dni;

    if (!dni) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'DNI no proporcionado'
        })
      };
    }

    // Leer el archivo JSON - Ruta absoluta para Netlify
    const dataPath = path.resolve(__dirname, '../../data/resultados.json');

    // Verificar si el archivo existe
    if (!fs.existsSync(dataPath)) {
      console.error('Archivo no encontrado en:', dataPath);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Archivo de datos no encontrado'
        })
      };
    }

    const rawData = fs.readFileSync(dataPath, 'utf8');
    const resultados = JSON.parse(rawData);

    // Buscar el DNI
    const resultado = resultados.find(r => String(r.dni).trim() === String(dni).trim());

    if (resultado) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Resultado encontrado',
          data: {
            dni: resultado.dni,
            nombre: resultado.nombre,
            puntaje: resultado.puntaje,
            area: resultado.area
          }
        })
      };
    } else {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'No se encontraron resultados para este DNI'
        })
      };
    }

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Error en el servidor'
      })
    };
  }
};
