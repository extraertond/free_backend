"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = require("../database/database");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Year = _database.sequelize.define("year", {
  id: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  grade: {
    type: _sequelize["default"].TEXT,
    unique: true
  }
}, {
  timestamps: false,
  freezeTableName: true
});

var _default = Year;
exports["default"] = _default;