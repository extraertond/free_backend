import Sequelize from "sequelize";
import { sequelize } from "../database/database";
import Class from "./Class";

const User_Class = sequelize.define(
  "User_Class",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    classId: {
      type: Sequelize.INTEGER,
    },
    type: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

Class.hasMany(User_Class, { foreignKey: "classId", sourceKey: "id" });
User_Class.belongsTo(Class, { foreignKey: "classId", sourceKey: "id" });

export default User_Class;
