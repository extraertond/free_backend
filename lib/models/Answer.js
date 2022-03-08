"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = require("../database/database");

var _Questionnaire = _interopRequireDefault(require("./Questionnaire"));

var _User = _interopRequireDefault(require("./User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Answer = _database.sequelize.define("answer", {
  id: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true
  },
  questionnaireId: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true
  },
  visible: {
    type: _sequelize["default"].BOOLEAN
  },
  grade: {
    type: _sequelize["default"].FLOAT
  },
  total_questions: {
    type: _sequelize["default"].INTEGER
  },
  questions_answered: {
    type: _sequelize["default"].INTEGER
  },
  revision: {
    type: _sequelize["default"].TEXT,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
});

_Questionnaire["default"].hasMany(Answer, {
  foreignKey: "questionnaireId",
  sourceKey: "id"
});

Answer.belongsTo(_Questionnaire["default"], {
  foreignKey: "questionnaireId",
  sourceKey: "id"
});

_User["default"].hasMany(Answer, {
  foreignKey: "userId",
  sourceKey: "id"
});

Answer.belongsTo(_User["default"], {
  foreignKey: "userId",
  sourceKey: "id"
});
var _default = Answer;
exports["default"] = _default;