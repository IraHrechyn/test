const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  // process.env.DB_NAME,
  // process.env.DB_USER,
  // process.env.POSTGRES_PASSWORD,
  // {
  //   dialect: 'postgres',
  //   host: process.env.DB_HOST,
  //   port: process.env.DB_PORT,
  // }
  'postgres',
  'postgres',
  'new_password',
  {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize;
