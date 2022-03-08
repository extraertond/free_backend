import Sequelize from "sequelize";
import { sequelize } from "../database/database";

const Subject = sequelize.define(
  "subject",
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
    enabled: {
      type: Sequelize.BOOLEAN,
    },
  },
  { timestamps: false, freezeTableName: true }
);

export default Subject;
