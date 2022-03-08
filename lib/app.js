"use strict";

require ('regenerator-runtime/runtime');

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireWildcard(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _morgan = _interopRequireDefault(require("morgan"));

var _users = _interopRequireDefault(require("./routes/users"));

var _roles = _interopRequireDefault(require("./routes/roles"));

var _subjects = _interopRequireDefault(require("./routes/subjects"));

var _years = _interopRequireDefault(require("./routes/years"));

var _classes = _interopRequireDefault(require("./routes/classes"));

var _questionnaires = _interopRequireDefault(require("./routes/questionnaires"));

var _helpers = require("./util/helpers");

var _responses = require("./util/responses");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var app = (0, _express["default"])();
app.use((0, _morgan["default"])("dev"));
app.use((0, _express.json)());
app.use((0, _cors["default"])());
app.use(function (req, res, next) {
  if ((0, _helpers.validateApiKey)(req.headers['x-api-key'])) next();else {
    (0, _responses.privilegesError)(res);
  }
});
app.use("/api/users", _users["default"]);
app.use("/api/subjects", _subjects["default"]);
app.use("/api/roles", _roles["default"]);
app.use("/api/years", _years["default"]);
app.use("/api/classes", _classes["default"]);
app.use("/api/questionnaires", _questionnaires["default"]);
var _default = app;
exports["default"] = _default;