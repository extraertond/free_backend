"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = require("../database/database");

var _Class = _interopRequireDefault(require("./Class"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var User_Class = _database.sequelize.define("User_Class", {
  id: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: _sequelize["default"].INTEGER
  },
  classId: {
    type: _sequelize["default"].INTEGER
  },
  type: {
    type: _sequelize["default"].TEXT,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
});

_Class["default"].hasMany(User_Class, {
  foreignKey: "classId",
  sourceKey: "id"
});

User_Class.belongsTo(_Class["default"], {
  foreignKey: "classId",
  sourceKey: "id"
});
var _default = User_Class;
exports["default"] = _default;