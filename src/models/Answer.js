import Sequelize from "sequelize";
import { sequelize } from "../database/database";
import Questionnaire from "./Questionnaire";
import User from "./User";

const Answer = sequelize.define(
  "answer",
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
    questionnaireId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    visible: {
      type: Sequelize.BOOLEAN,
    },
    grade: {
      type: Sequelize.FLOAT,
    },
    total_questions: {
      type: Sequelize.INTEGER,
    },
    questions_answered: {
      type: Sequelize.INTEGER,
    },
    revision: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

Questionnaire.hasMany(Answer, { foreignKey: "questionnaireId", sourceKey: "id" });
Answer.belongsTo(Questionnaire, { foreignKey: "questionnaireId", sourceKey: "id" });

User.hasMany(Answer, { foreignKey: "userId", sourceKey: "id" });
Answer.belongsTo(User, { foreignKey: "userId", sourceKey: "id" });

export default Answer;
