"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = require("../database/database");

var _Class = _interopRequireDefault(require("./Class"));

var _Role = _interopRequireDefault(require("./Role"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var User = _database.sequelize.define("user", {
  id: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roleId: {
    type: _sequelize["default"].INTEGER,
    primaryKey: true
  },
  name: {
    type: _sequelize["default"].TEXT,
    allowNull: false
  },
  lastname1: {
    type: _sequelize["default"].TEXT,
    allowNull: false
  },
  lastname2: {
    type: _sequelize["default"].TEXT
  },
  username: {
    type: _sequelize["default"].TEXT,
    allowNull: false,
    validate: {
      isAlphanumeric: true
    },
    unique: true
  },
  password: {
    type: _sequelize["default"].TEXT,
    allowNull: false
  },
  token: {
    type: _sequelize["default"].TEXT,
    allowNull: true
  },
  initialized: {
    type: _sequelize["default"].BOOLEAN
  }
}, {
  timestamps: false,
  freezeTableName: true
});

_Role["default"].hasMany(User, {
  foreignKey: "roleId",
  sourceKey: "id"
});

User.belongsTo(_Role["default"], {
  foreignKey: "roleId",
  sourceKey: "id"
});
User.belongsToMany(_Class["default"], {
  through: "User_Class"
});

_Class["default"].belongsToMany(User, {
  through: "User_Class"
});

var _default = User;
exports["default"] = _default;