import Sequelize from "sequelize";
import { sequelize } from "../database/database";
import Questionnaire_Class from "./Questionnaire_Class";
import Subject from "./Subject";
import User from "./User";

const Questionnaire = sequelize.define(
  "questionnaire",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    subjectId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    visible: {
      type: Sequelize.BOOLEAN,
    },
    reviewable: {
      type: Sequelize.BOOLEAN,
    },
    can_remake: {
      type: Sequelize.BOOLEAN,
    },
    view_grade: {
      type: Sequelize.BOOLEAN,
    },
    title: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    raw_data: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    student_data: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

User.hasMany(Questionnaire, { foreignKey: "userId", sourceKey: "id" });
Questionnaire.belongsTo(User, { foreignKey: "userId", sourceKey: "id" });
Subject.hasMany(Questionnaire, { foreignKey: "subjectId", sourceKey: "id" });
Questionnaire.belongsTo(Subject, { foreignKey: "subjectId", sourceKey: "id" });
Questionnaire.hasMany(Questionnaire_Class, { onDelete: 'cascade', foreignKey: "questionnaireId", sourceKey: "id" });
Questionnaire_Class.belongsTo(Questionnaire, { onDelete: 'cascade', foreignKey: "questionnaireId", sourceKey: "id" }); 


export default Questionnaire;
