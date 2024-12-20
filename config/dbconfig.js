require('dotenv').config();
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.SQL_DATABASE,
  process.env.SQL_USERNAME,
  process.env.SQL_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    port:3306
  }
);

sequelize.authenticate()
  .then(() => {
    console.log("Connection established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });


module.exports = {sequelize};  // Exporting the Sequelize instance directly
