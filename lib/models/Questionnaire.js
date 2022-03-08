"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = require("../database/database");

var _Questionnaire_Class = _interopRequireDefault(require("./Questionnaire_Class"));

var _Subject = _interopRequireDefault(require("./Subject"));

var _User = _interopRequireDefault(require("./User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Questionnaire = _database.sequelize.define("questionnaire", {
  id: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true
  },
  subjectId: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true
  },
  visible: {
    type: _sequelize["default"].BOOLEAN
  },
  reviewable: {
    type: _sequelize["default"].BOOLEAN
  },
  can_remake: {
    type: _sequelize["default"].BOOLEAN
  },
  view_grade: {
    type: _sequelize["default"].BOOLEAN
  },
  title: {
    type: _sequelize["default"].TEXT,
    allowNull: false
  },
  raw_data: {
    type: _sequelize["default"].TEXT,
    allowNull: false
  },
  student_data: {
    type: _sequelize["default"].TEXT,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
});

_User["default"].hasMany(Questionnaire, {
  foreignKey: "userId",
  sourceKey: "id"
});

Questionnaire.belongsTo(_User["default"], {
  foreignKey: "userId",
  sourceKey: "id"
});

_Subject["default"].hasMany(Questionnaire, {
  foreignKey: "subjectId",
  sourceKey: "id"
});

Questionnaire.belongsTo(_Subject["default"], {
  foreignKey: "subjectId",
  sourceKey: "id"
});
Questionnaire.hasMany(_Questionnaire_Class["default"], {
  onDelete: 'cascade',
  foreignKey: "questionnaireId",
  sourceKey: "id"
});

_Questionnaire_Class["default"].belongsTo(Questionnaire, {
  onDelete: 'cascade',
  foreignKey: "questionnaireId",
  sourceKey: "id"
});

var _default = Questionnaire;
exports["default"] = _default;