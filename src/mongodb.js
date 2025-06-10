const dotenv=require('dotenv');
dotenv.config({ path: './src/.env' });//agregado para que funcione el .env
const {MongoClient} = require('mongodb');


const URI= process.env.MONGODB_URLSTRING;
const client = new MongoClient(URI);

// Función para conectar
async function connectToMongoDB() {
    try {
      await client.connect();
      console.log('Conectado a MongoDB');
      return client;
    } catch (error) {
      console.error('Error al conectar a MongoDB:', error);
      return null;
    }
  }

// Función para desconectar
async function disconnectFromMongoDB() {
    try {
      await client.close();
      console.log('Desconectado de MongoDB');
    } catch (error) {
      console.error('Error al desconectar de MongoDB:', error);
    }
  }
  
  // Exportamos ambas funciones
  module.exports = { connectToMongoDB, disconnectFromMongoDB };


