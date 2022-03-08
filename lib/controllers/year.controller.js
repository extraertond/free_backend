"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getYears = getYears;

var _nodeEnvFile = _interopRequireDefault(require("node-env-file"));

var _Year = _interopRequireDefault(require("../models/Year"));

var _responses = require("../util/responses");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(0, _nodeEnvFile["default"])(__dirname + "/../../.env");

function getYears(_x, _x2) {
  return _getYears.apply(this, arguments);
}

function _getYears() {
  _getYears = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var years;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (req.headers.token) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", (0, _responses.privilegesError)(res));

          case 3:
            _context.next = 5;
            return _Year["default"].findAll();

          case 5:
            years = _context.sent;
            if (years) (0, _responses.yearsOk)(res, years);
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            (0, _responses.serverError)(res, _context.t0);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  }));
  return _getYears.apply(this, arguments);
}