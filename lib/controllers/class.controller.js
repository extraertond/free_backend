"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClasses = getClasses;
exports.getClassesByTeacher = getClassesByTeacher;
exports.getBasicClasses = getBasicClasses;
exports.createClass = createClass;
exports.deleteClass = deleteClass;
exports.updateTeachers = updateTeachers;
exports.updateStudents = updateStudents;

var _nodeEnvFile = _interopRequireDefault(require("node-env-file"));

var _Class = _interopRequireDefault(require("../models/Class"));

var _User = _interopRequireDefault(require("../models/User"));

var _Year = _interopRequireDefault(require("../models/Year"));

var _responses = require("../util/responses");

var _sequelize = require("sequelize");

var _User_Class = _interopRequireDefault(require("../models/User_Class"));

var _Questionnaire_Class = _interopRequireDefault(require("../models/Questionnaire_Class"));

var _database = require("../database/database");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(0, _nodeEnvFile["default"])(__dirname + "/../../.env");

function getClasses(_x, _x2) {
  return _getClasses.apply(this, arguments);
}

function _getClasses() {
  _getClasses = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var classes, _iterator, _step, _loop;

    return regeneratorRuntime.wrap(function _callee$(_context2) {
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
            return _Class["default"].findAll({
              include: [_Year["default"], {
                model: _User["default"],
                attributes: ["id", "name", "lastname1", "lastname2", "roleId"]
              }]
            });

          case 5:
            classes = _context2.sent;
            _iterator = _createForOfIteratorHelper(classes);
            _context2.prev = 7;
            _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {
              var auxClass, assignedStudents, excludeStudentsIds, availableStudents, excludeIds, availableTeachers;
              return regeneratorRuntime.wrap(function _loop$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      auxClass = _step.value;
                      assignedStudents = auxClass.dataValues.users.filter(function (user) {
                        return user.roleId === 3;
                      });
                      auxClass.assignedStudents = assignedStudents;
                      auxClass.dataValues.assignedStudents = assignedStudents;
                      excludeStudentsIds = [];
                      assignedStudents.forEach(function (user) {
                        excludeStudentsIds.push(user.id);
                      });
                      _context.next = 8;
                      return _User["default"].findAll({
                        attributes: ["id", "name", "lastname1", "lastname2"],
                        where: {
                          id: _defineProperty({}, _sequelize.Op.notIn, excludeStudentsIds),
                          roleId: 3
                        }
                      });

                    case 8:
                      availableStudents = _context.sent;
                      auxClass.availableStudents = availableStudents;
                      auxClass.dataValues.availableStudents = availableStudents;
                      auxClass.dataValues.users = auxClass.dataValues.users.filter(function (user) {
                        return user.roleId === 2;
                      });
                      auxClass.dataValues.assignedStudents = assignedStudents;
                      auxClass.users = auxClass.dataValues.users;
                      excludeIds = [];
                      auxClass.dataValues.users.forEach(function (user) {
                        excludeIds.push(user.id);
                      });
                      _context.next = 18;
                      return _User["default"].findAll({
                        attributes: ["id", "name", "lastname1", "lastname2"],
                        where: {
                          id: _defineProperty({}, _sequelize.Op.notIn, excludeIds),
                          roleId: 2
                        }
                      });

                    case 18:
                      availableTeachers = _context.sent;
                      auxClass.dataValues.availableTeachers = availableTeachers;
                      auxClass.availableTeachers = availableTeachers;

                    case 21:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _loop);
            });

            _iterator.s();

          case 10:
            if ((_step = _iterator.n()).done) {
              _context2.next = 14;
              break;
            }

            return _context2.delegateYield(_loop(), "t0", 12);

          case 12:
            _context2.next = 10;
            break;

          case 14:
            _context2.next = 19;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t1 = _context2["catch"](7);

            _iterator.e(_context2.t1);

          case 19:
            _context2.prev = 19;

            _iterator.f();

            return _context2.finish(19);

          case 22:
            if (!classes) {
              _context2.next = 24;
              break;
            }

            return _context2.abrupt("return", (0, _responses.classesOk)(res, classes));

          case 24:
            _context2.next = 29;
            break;

          case 26:
            _context2.prev = 26;
            _context2.t2 = _context2["catch"](0);
            return _context2.abrupt("return", (0, _responses.serverError)(res, _context2.t2));

          case 29:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee, null, [[0, 26], [7, 16, 19, 22]]);
  }));
  return _getClasses.apply(this, arguments);
}

function getClassesByTeacher(_x3, _x4) {
  return _getClassesByTeacher.apply(this, arguments);
}

function _getClassesByTeacher() {
  _getClassesByTeacher = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var user, classes;
    return regeneratorRuntime.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            if (req.headers.token) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", (0, _responses.privilegesError)(res));

          case 3:
            _context3.next = 5;
            return _User["default"].findOne({
              where: {
                token: req.headers.token
              }
            });

          case 5:
            user = _context3.sent;

            if (!user) {
              (0, _responses.privilegesError)(res);
            }

            _context3.next = 9;
            return _User_Class["default"].findAll({
              include: [{
                model: _Class["default"],
                include: [_Year["default"]]
              }],
              where: {
                userId: user.id,
                type: "PR"
              }
            });

          case 9:
            classes = _context3.sent;

            if (classes) {
              (0, _responses.classesOk)(res, classes);
            }

            _context3.next = 16;
            break;

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](0);
            (0, _responses.serverError)(res, _context3.t0);

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee2, null, [[0, 13]]);
  }));
  return _getClassesByTeacher.apply(this, arguments);
}

function getBasicClasses(_x5, _x6) {
  return _getBasicClasses.apply(this, arguments);
}

function _getBasicClasses() {
  _getBasicClasses = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var classes;
    return regeneratorRuntime.wrap(function _callee3$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;

            if (req.headers.token) {
              _context4.next = 3;
              break;
            }

            return _context4.abrupt("return", (0, _responses.privilegesError)(res));

          case 3:
            _context4.next = 5;
            return _Class["default"].findAll({
              include: [_Year["default"]]
            });

          case 5:
            classes = _context4.sent;

            if (classes) {
              (0, _responses.classesOk)(res, classes);
            }

            _context4.next = 12;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](0);
            (0, _responses.serverError)(res, _context4.t0);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee3, null, [[0, 9]]);
  }));
  return _getBasicClasses.apply(this, arguments);
}

function createClass(_x7, _x8) {
  return _createClass.apply(this, arguments);
}

function _createClass() {
  _createClass = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var _req$body$class, grade, yearId, newClass, auxClass;

    return regeneratorRuntime.wrap(function _callee4$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$body$class = req.body["class"], grade = _req$body$class.grade, yearId = _req$body$class.yearId;
            _context5.prev = 1;

            if (!(!grade || !yearId)) {
              _context5.next = 4;
              break;
            }

            return _context5.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context5.next = 6;
            return _Class["default"].create({
              grade: grade,
              yearId: yearId,
              enabled: true
            });

          case 6:
            newClass = _context5.sent;

            if (!newClass) {
              _context5.next = 11;
              break;
            }

            _context5.next = 10;
            return _Class["default"].findOne({
              where: {
                id: newClass.id
              },
              include: ["year"]
            });

          case 10:
            auxClass = _context5.sent;

          case 11:
            return _context5.abrupt("return", (0, _responses.classCreatedOk)(res, auxClass));

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5["catch"](1);
            _context5.t0.original && _context5.t0.original.code == "ER_DUP_ENTRY" ? (0, _responses.duplicateClassError)(res) : (0, _responses.serverError)(res, _context5.t0);

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee4, null, [[1, 14]]);
  }));
  return _createClass.apply(this, arguments);
}

function deleteClass(_x9, _x10) {
  return _deleteClass.apply(this, arguments);
}

function _deleteClass() {
  _deleteClass = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var id;
    return regeneratorRuntime.wrap(function _callee6$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            id = req.params.id;
            _context7.prev = 1;

            if (id) {
              _context7.next = 6;
              break;
            }

            return _context7.abrupt("return", (0, _responses.badRequestError)(res));

          case 6:
            _context7.next = 8;
            return _database.sequelize.transaction( /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
                return regeneratorRuntime.wrap(function _callee5$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return _User_Class["default"].destroy({
                          where: {
                            classId: id
                          }
                        }, {
                          transaction: t
                        });

                      case 2:
                        _context6.next = 4;
                        return _Questionnaire_Class["default"].destroy({
                          where: {
                            classId: id
                          }
                        }, {
                          transaction: t
                        });

                      case 4:
                        _context6.next = 6;
                        return _Class["default"].destroy({
                          where: {
                            id: id
                          }
                        }, {
                          transaction: t
                        });

                      case 6:
                        return _context6.abrupt("return", (0, _responses.ClassDeletedOk)(res));

                      case 7:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x15) {
                return _ref.apply(this, arguments);
              };
            }());

          case 8:
            _context7.next = 13;
            break;

          case 10:
            _context7.prev = 10;
            _context7.t0 = _context7["catch"](1);
            (0, _responses.serverError)(res, _context7.t0);

          case 13:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee6, null, [[1, 10]]);
  }));
  return _deleteClass.apply(this, arguments);
}

function updateTeachers(_x11, _x12) {
  return _updateTeachers.apply(this, arguments);
}

function _updateTeachers() {
  _updateTeachers = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
    var teachers, class_id, auxClass, _iterator2, _step2, teacher;

    return regeneratorRuntime.wrap(function _callee7$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            teachers = req.body.teachers;
            class_id = req.body.class_id;
            _context8.prev = 2;

            if (!(!class_id || !teachers)) {
              _context8.next = 7;
              break;
            }

            return _context8.abrupt("return", (0, _responses.badRequestError)(res));

          case 7:
            _context8.next = 9;
            return _Class["default"].findOne({
              where: {
                id: class_id
              }
            });

          case 9:
            auxClass = _context8.sent;

            if (!auxClass) {
              _context8.next = 32;
              break;
            }

            _User_Class["default"].destroy({
              where: {
                classId: class_id,
                type: "PR"
              }
            });

            _iterator2 = _createForOfIteratorHelper(teachers);
            _context8.prev = 13;

            _iterator2.s();

          case 15:
            if ((_step2 = _iterator2.n()).done) {
              _context8.next = 21;
              break;
            }

            teacher = _step2.value;
            _context8.next = 19;
            return _User_Class["default"].create({
              userId: teacher.id,
              classId: class_id,
              type: "PR"
            });

          case 19:
            _context8.next = 15;
            break;

          case 21:
            _context8.next = 26;
            break;

          case 23:
            _context8.prev = 23;
            _context8.t0 = _context8["catch"](13);

            _iterator2.e(_context8.t0);

          case 26:
            _context8.prev = 26;

            _iterator2.f();

            return _context8.finish(26);

          case 29:
            (0, _responses.updateTeachersOk)(res, teachers);
            _context8.next = 33;
            break;

          case 32:
            incorrectCredentialsError(res);

          case 33:
            _context8.next = 38;
            break;

          case 35:
            _context8.prev = 35;
            _context8.t1 = _context8["catch"](2);
            (0, _responses.serverError)(res, _context8.t1);

          case 38:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee7, null, [[2, 35], [13, 23, 26, 29]]);
  }));
  return _updateTeachers.apply(this, arguments);
}

function updateStudents(_x13, _x14) {
  return _updateStudents.apply(this, arguments);
}

function _updateStudents() {
  _updateStudents = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
    var students, class_id, auxClass, _iterator3, _step3, student;

    return regeneratorRuntime.wrap(function _callee8$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            students = req.body.students;
            class_id = req.body.class_id;
            _context9.prev = 2;

            if (!(!class_id || !students)) {
              _context9.next = 7;
              break;
            }

            return _context9.abrupt("return", (0, _responses.badRequestError)(res));

          case 7:
            _context9.next = 9;
            return _Class["default"].findOne({
              where: {
                id: class_id
              }
            });

          case 9:
            auxClass = _context9.sent;

            if (!auxClass) {
              _context9.next = 32;
              break;
            }

            _User_Class["default"].destroy({
              where: {
                classId: class_id,
                type: "AL"
              }
            });

            _iterator3 = _createForOfIteratorHelper(students);
            _context9.prev = 13;

            _iterator3.s();

          case 15:
            if ((_step3 = _iterator3.n()).done) {
              _context9.next = 21;
              break;
            }

            student = _step3.value;
            _context9.next = 19;
            return _User_Class["default"].create({
              userId: student.id,
              classId: class_id,
              type: "AL"
            });

          case 19:
            _context9.next = 15;
            break;

          case 21:
            _context9.next = 26;
            break;

          case 23:
            _context9.prev = 23;
            _context9.t0 = _context9["catch"](13);

            _iterator3.e(_context9.t0);

          case 26:
            _context9.prev = 26;

            _iterator3.f();

            return _context9.finish(26);

          case 29:
            (0, _responses.updateStudentsOk)(res, students);
            _context9.next = 33;
            break;

          case 32:
            incorrectCredentialsError(res);

          case 33:
            _context9.next = 38;
            break;

          case 35:
            _context9.prev = 35;
            _context9.t1 = _context9["catch"](2);
            (0, _responses.serverError)(res, _context9.t1);

          case 38:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee8, null, [[2, 35], [13, 23, 26, 29]]);
  }));
  return _updateStudents.apply(this, arguments);
}