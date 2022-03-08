"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSubjects = getSubjects;
exports.getEnabledSubjects = getEnabledSubjects;
exports.updateSubject = updateSubject;
exports.createSubject = createSubject;

var _nodeEnvFile = _interopRequireDefault(require("node-env-file"));

var _Subject = _interopRequireDefault(require("../models/Subject"));

var _responses = require("../util/responses");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(0, _nodeEnvFile["default"])(__dirname + "/../../.env");

function getSubjects(_x, _x2) {
  return _getSubjects.apply(this, arguments);
}

function _getSubjects() {
  _getSubjects = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var subjects;
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
            return _Subject["default"].findAll();

          case 5:
            subjects = _context.sent;
            if (subjects) (0, _responses.subjectsOk)(res, subjects);
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
  return _getSubjects.apply(this, arguments);
}

function getEnabledSubjects(_x3, _x4) {
  return _getEnabledSubjects.apply(this, arguments);
}

function _getEnabledSubjects() {
  _getEnabledSubjects = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var subjects;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            if (req.headers.token) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return", (0, _responses.privilegesError)(res));

          case 3:
            _context2.next = 5;
            return _Subject["default"].findAll({
              where: {
                enabled: true
              }
            });

          case 5:
            subjects = _context2.sent;
            if (subjects) (0, _responses.subjectsOk)(res, subjects);
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](0);
            (0, _responses.serverError)(res, _context2.t0);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 9]]);
  }));
  return _getEnabledSubjects.apply(this, arguments);
}

function updateSubject(_x5, _x6) {
  return _updateSubject.apply(this, arguments);
}

function _updateSubject() {
  _updateSubject = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var _req$body$subject, id, name, enabled, subject;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$body$subject = req.body.subject, id = _req$body$subject.id, name = _req$body$subject.name, enabled = _req$body$subject.enabled;
            _context3.prev = 1;

            if (!(!id || !name || enabled == undefined)) {
              _context3.next = 4;
              break;
            }

            return _context3.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context3.next = 6;
            return _Subject["default"].findOne({
              attributes: ["id", "name", "enabled"],
              where: {
                id: id
              }
            });

          case 6:
            subject = _context3.sent;

            if (!subject) {
              _context3.next = 13;
              break;
            }

            _context3.next = 10;
            return subject.update({
              enabled: enabled,
              name: name
            });

          case 10:
            (0, _responses.updateSubjectOk)(res, subject);
            _context3.next = 14;
            break;

          case 13:
            incorrectCredentialsError(res);

          case 14:
            _context3.next = 19;
            break;

          case 16:
            _context3.prev = 16;
            _context3.t0 = _context3["catch"](1);
            (0, _responses.serverError)(res, _context3.t0);

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 16]]);
  }));
  return _updateSubject.apply(this, arguments);
}

function createSubject(_x7, _x8) {
  return _createSubject.apply(this, arguments);
}

function _createSubject() {
  _createSubject = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var name, newSubject;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            name = req.body.subject.name;
            _context4.prev = 1;

            if (name) {
              _context4.next = 4;
              break;
            }

            return _context4.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context4.next = 6;
            return _Subject["default"].create({
              name: name,
              enabled: true
            });

          case 6:
            newSubject = _context4.sent;
            if (newSubject) (0, _responses.subjectCreatedOk)(res, newSubject);
            _context4.next = 13;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](1);
            _context4.t0.original && _context4.t0.original.code == "ER_DUP_ENTRY" ? (0, _responses.duplicateSubjectError)(res) : (0, _responses.serverError)(res, _context4.t0);

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 10]]);
  }));
  return _createSubject.apply(this, arguments);
}