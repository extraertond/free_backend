import Sequelize from "sequelize";
import env from "node-env-file";
env(__dirname + "/../../.env");

export const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: 0,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: { timestamps: false },
  }
);
