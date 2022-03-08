"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = require("../database/database");

var _Class = _interopRequireDefault(require("./Class"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Questionnaire_Class = _database.sequelize.define("questionnaire_class", {
  id: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  questionnaireId: {
    type: _sequelize["default"].INTEGER
  },
  classId: {
    type: _sequelize["default"].INTEGER
  }
}, {
  timestamps: false,
  freezeTableName: true
});

_Class["default"].hasMany(Questionnaire_Class, {
  foreignKey: "classId",
  sourceKey: "id"
});

Questionnaire_Class.belongsTo(_Class["default"], {
  foreignKey: "classId",
  sourceKey: "id"
});
var _default = Questionnaire_Class;
exports["default"] = _default;