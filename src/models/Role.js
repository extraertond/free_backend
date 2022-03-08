import Sequelize from "sequelize";
import { sequelize } from "../database/database";

const Role = sequelize.define(
  "role",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.TEXT,
      unique: true,
    },
    see_all: {
      type: Sequelize.BOOLEAN,
    },
    create_users: {
      type: Sequelize.BOOLEAN,
    },
  },
  { timestamps: false, freezeTableName: true }
);

export default Role;
