// Importación de los módulos necesarios de Express, Axios, Crypto, Moment y Lodash.
import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import moment from 'moment';
import _ from 'lodash';
import chalk from 'chalk';
// Creación de una instancia de la aplicación Express.
const app = express();
const port = 3000;
const users = []; // Declaración de un array vacío para almacenar los usuarios registrados.

// Ruta para registrar usuarios
app.get('/registrar-usuarios', async (req, res) => {
  try {
    // Hacer una solicitud a la API Random User para obtener 50 usuarios
    const response = await axios.get('https://randomuser.me/api/?results=50');
    const userDataList = response.data.results;

    // Iterar sobre cada usuario obtenido y registrarlos
    userDataList.forEach(userData => {
      // Generar un ID alfanumérico aleatorio para cada usuario
      const userId = crypto.randomBytes(16).toString("hex");
      const timestamp = moment().format('MMMM Do YYYY, h:mm:ss a'); // Obtener la fecha y hora actual
      // Crear un nuevo objeto de usuario con los datos obtenidos y agregarlo al array 'users'
      const newUser = {
        id: userId,
        nombre: userData.name.first,
        apellido: userData.name.last,
        sexo: userData.gender,
        timestamp: timestamp
      };
      users.push(newUser);
    });

    res.send('Usuarios registrados correctamente'); // Enviar una respuesta exitosa
  } catch (error) {
    console.error('Error al registrar usuarios:', error);
    res.status(500).send('Error al registrar usuarios'); // Manejar errores y enviar una respuesta de error
  }
});

// Ruta para consultar usuarios
app.get('/consultar-usuarios', (req, res) => {
  // Ordenar usuarios por sexo
  const sortedUsers = _.sortBy(users, 'sexo');

  // Separar usuarios por sexo
  const hombres = _.filter(sortedUsers, { sexo: 'male' });
  const mujeres = _.filter(sortedUsers, { sexo: 'female' });

  // Función para formatear la lista de usuarios
  const formatUsersList = (users) => {
    return users.map((user, index) => {
      return `${index + 1}. Nombre: ${user.nombre} - Apellido: ${user.apellido} - ID: ${user.id} - Timestamp: ${user.timestamp}`;
    });
  };

  // Formatear los datos de mujeres y hombres
  const mujeresFormatted = formatUsersList(mujeres);
  const hombresFormatted = formatUsersList(hombres);

  // Imprimir la lista de usuarios formateada en la consola del servidor
  console.log(chalk.bold.blue('Lista de usuarios (Mujeres):'));
  mujeresFormatted.forEach(user => console.log(user));
  console.log(chalk.bold.blue('Lista de usuarios (Hombres):'));
  hombresFormatted.forEach(user => console.log(user));

  // Enviar los datos formateados en la respuesta
  const formattedResult = {
    Mujeres: mujeresFormatted,
    Hombres: hombresFormatted
  };

  res.send(formattedResult);
});


// Levantar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`); // Mostrar un mensaje en la consola indicando que el servidor está escuchando
});
