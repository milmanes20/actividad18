const express = require('express');
const { connectToMongoDB, disconnectFromMongoDB } = require('./src/mongodb.js');

const app = express();
const PORT = process.env.PORT || 3008;
// Middleware global: forzar charset a UTF-8 y formato JSON
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Ruta principal de bienvenida
app.get('/', (req, res) => {
  res.status(200).end('¡Bienvenido a la API de frutas!');
});

app.get('/frutas', async (req, res) => {
    const client = await connectToMongoDB();
    const db = client.db('frutas');
    const frutas = await db.collection('frutas').find().toArray();
  
    await disconnectFromMongoDB();
    res.json(frutas);
  });
  // Ruta para obtener una fruta por ID
  // Ejemplo: GET /frutas/1
  app.get('/frutas/:id', async (req, res) => {
    const frutaId = parseInt(req.params.id) || 0;
    const client = await connectToMongoDB();
    const db = client.db('frutas');
    const fruta = await db.collection('frutas').findOne({ id: frutaId });
  
    await disconnectFromMongoDB();
    if (!fruta) { // al usar findOne, si no se encuentra el documento, devuelve null
      // Si no se encuentra la fruta, respondemos con un error 404
      return res.status(404).json({ error: 'Fruta no encontrada' });
    }
    res.json(fruta);
  });

// Ruta para buscar frutas por nombre
  app.get('/frutas/nombre/:nombre', async (req, res) => {
    const nombre = req.params.nombre;
    const client = await connectToMongoDB();
    const db = client.db('frutas');
  
    const frutas = await db.collection('frutas').find({
      nombre: { $regex: new RegExp(nombre, 'i') } // 'i' = insensible a mayúsculas
    }).toArray();
  
    await disconnectFromMongoDB();
    res.json(frutas);
  });

// Ruta para buscar frutas por precio mayor o igual al especificado
app.get('/frutas/precio/:precio', async (req, res) => {
  const precio = parseFloat(req.params.precio);
  const client = await connectToMongoDB();
  const db = client.db('frutas');

  const frutas = await db.collection('frutas').find({
    precio: { $gte: precio }
  }).toArray();

  await disconnectFromMongoDB();
  // Si no se encontraron frutas, respondemos con un error 404
  if (frutas.length == 0) { //al usar find.toArray(), si no se encuentra ningún documento, devuelve un array vacío
    return res.status(404).send('No se encontraron frutas con ese precio o más' );
  }
  res.json(frutas);
});


  // Inicio del servidor- se agrego esta línea para que el servidor escuche en el puerto especificado 
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});