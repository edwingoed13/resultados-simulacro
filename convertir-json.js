// Script para corregir el formato del JSON
// Uso: node convertir-json.js

const fs = require('fs');
const path = require('path');

// Lee el archivo JSON original (con formato incorrecto)
const archivoEntrada = path.join(__dirname, 'data', 'resultados-original.json');
const archivoSalida = path.join(__dirname, 'data', 'resultados.json');

try {
  // Leer el archivo
  const contenido = fs.readFileSync(archivoEntrada, 'utf8');
  const datos = JSON.parse(contenido);

  // Convertir cada registro al formato correcto
  const datosCorregidos = datos.map(registro => ({
    dni: String(registro.DNI || registro.dni || ''),
    nombre: String(registro['Apellidos y Nombres'] || registro.nombre || ''),
    puntaje: String(registro.Puntaje || registro.puntaje || ''),
    area: String(registro.Area || registro.area || '')
  }));

  // Guardar el archivo corregido
  fs.writeFileSync(archivoSalida, JSON.stringify(datosCorregidos, null, 2), 'utf8');

  console.log('✓ Conversión exitosa!');
  console.log(`✓ Total de registros: ${datosCorregidos.length}`);
  console.log(`✓ Archivo guardado en: ${archivoSalida}`);

} catch (error) {
  console.error('Error:', error.message);
  console.log('\nAsegúrate de:');
  console.log('1. Guardar tu JSON convertido como: data/resultados-original.json');
  console.log('2. Ejecutar: node convertir-json.js');
}
