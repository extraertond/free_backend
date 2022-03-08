import Sequelize from "sequelize";
import { sequelize } from "../database/database";
import Year from "./Year";

const Class = sequelize.define(
  "class",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    yearId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    grade: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    enabled: {
      type: Sequelize.BOOLEAN,
    },
  },
  { timestamps: false, freezeTableName: true }
);

Year.hasMany(Class, { foreignKey: "yearId", sourceKey: "id" });
Class.belongsTo(Year, { foreignKey: "yearId", sourceKey: "id" });

export default Class;
