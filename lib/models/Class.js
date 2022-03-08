"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = require("../database/database");

var _Year = _interopRequireDefault(require("./Year"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Class = _database.sequelize.define("class", {
  id: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  yearId: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true
  },
  grade: {
    type: _sequelize["default"].TEXT,
    allowNull: false
  },
  enabled: {
    type: _sequelize["default"].BOOLEAN
  }
}, {
  timestamps: false,
  freezeTableName: true
});

_Year["default"].hasMany(Class, {
  foreignKey: "yearId",
  sourceKey: "id"
});

Class.belongsTo(_Year["default"], {
  foreignKey: "yearId",
  sourceKey: "id"
});
var _default = Class;
exports["default"] = _default;