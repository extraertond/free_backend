import Sequelize from "sequelize";
import { sequelize } from "../database/database";

const Year = sequelize.define(
  "year",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    grade: {
      type: Sequelize.TEXT,
      unique: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

export default Year;
