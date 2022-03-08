import Sequelize from "sequelize";
import { sequelize } from "../database/database";
import Class from "./Class";
import Role from "./Role";

const User = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roleId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    lastname1: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    lastname2: {
      type: Sequelize.TEXT,
    },
    username: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        isAlphanumeric: true,
      },
      unique: true,
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    token: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    initialized: {
      type: Sequelize.BOOLEAN,
    },
  },
  { timestamps: false, freezeTableName: true }
);

Role.hasMany(User, { foreignKey: "roleId", sourceKey: "id" });
User.belongsTo(Role, { foreignKey: "roleId", sourceKey: "id" });
User.belongsToMany(Class, { through: "User_Class" });
Class.belongsToMany(User, { through: "User_Class" });

export default User;
