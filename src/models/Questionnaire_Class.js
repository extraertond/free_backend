import Sequelize from "sequelize";
import { sequelize } from "../database/database";
import Class from "./Class";

const Questionnaire_Class = sequelize.define(
  "questionnaire_class",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    questionnaireId: {
      type: Sequelize.INTEGER,
    },
    classId: {
      type: Sequelize.INTEGER,
    }
  },
  { timestamps: false, freezeTableName: true }
);

Class.hasMany(Questionnaire_Class, { foreignKey: "classId", sourceKey: "id" });
Questionnaire_Class.belongsTo(Class, { foreignKey: "classId", sourceKey: "id" });
export default Questionnaire_Class;
 