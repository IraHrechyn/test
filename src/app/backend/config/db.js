const {Sequelize} = require('sequelize');

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
//   host: process.env.DB_HOST,
//   dialect: 'mysql'
// });

const bd = require('mysql');
let connection = bd.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'qazwsxedc12',
  port: 3306
});


connection.authorized({ force: false })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Failed to synchronize database:', error);
  });


module.exports = connection;
