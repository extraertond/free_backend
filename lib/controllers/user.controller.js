"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUser = createUser;
exports.loginUser = loginUser;
exports.data = data;
exports.changePassword = changePassword;
exports.resetPassword = resetPassword;
exports.getTeachers = getTeachers;
exports.getStudents = getStudents;
exports.getStudentsByTeacherClass = getStudentsByTeacherClass;
exports.deleteUser = deleteUser;

var _md = _interopRequireDefault(require("md5"));

var _nodeEnvFile = _interopRequireDefault(require("node-env-file"));

var _User = _interopRequireDefault(require("../models/User"));

var _Role = _interopRequireDefault(require("../models/Role"));

var _helpers = require("../util/helpers");

var _responses = require("../util/responses");

var _Class = _interopRequireDefault(require("../models/Class"));

var _Year = _interopRequireDefault(require("../models/Year"));

var _User_Class = _interopRequireDefault(require("../models/User_Class"));

var _Answer = _interopRequireDefault(require("../models/Answer"));

var _database = require("../database/database");

var _Questionnaire = _interopRequireDefault(require("../models/Questionnaire"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(0, _nodeEnvFile["default"])(__dirname + "/../../.env");

function createUser(_x, _x2) {
  return _createUser.apply(this, arguments);
}

function _createUser() {
  _createUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body$user, role, name, lastname1, lastname2, username, password, newUser;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body$user = req.body.user, role = _req$body$user.role, name = _req$body$user.name, lastname1 = _req$body$user.lastname1, lastname2 = _req$body$user.lastname2, username = _req$body$user.username, password = _req$body$user.password;
            _context.prev = 1;

            if (!(!role || !name || !username || !password)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context.t0 = _User["default"];
            _context.next = 7;
            return _Role["default"].findOne({
              attributes: ["id"],
              where: {
                name: role
              }
            });

          case 7:
            _context.t1 = _context.sent.id;
            _context.t2 = name;
            _context.t3 = lastname1;
            _context.t4 = lastname2;
            _context.t5 = username;
            _context.next = 14;
            return (0, _helpers.encryptPassword)(password);

          case 14:
            _context.t6 = _context.sent;
            _context.next = 17;
            return (0, _md["default"])(username + ";" + name + ";" + process.env.SALT_CODE);

          case 17:
            _context.t7 = _context.sent;
            _context.t8 = {
              roleId: _context.t1,
              name: _context.t2,
              lastname1: _context.t3,
              lastname2: _context.t4,
              username: _context.t5,
              password: _context.t6,
              token: _context.t7
            };
            _context.next = 21;
            return _context.t0.create.call(_context.t0, _context.t8);

          case 21:
            newUser = _context.sent;
            if (newUser) (0, _responses.userCreatedOk)(res, newUser);
            _context.next = 28;
            break;

          case 25:
            _context.prev = 25;
            _context.t9 = _context["catch"](1);
            _context.t9.original && _context.t9.original.code == "ER_DUP_ENTRY" ? (0, _responses.duplicateUsernameError)(res) : (0, _responses.serverError)(res, _context.t9);

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 25]]);
  }));
  return _createUser.apply(this, arguments);
}

function loginUser(_x3, _x4) {
  return _loginUser.apply(this, arguments);
}

function _loginUser() {
  _loginUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$body$user2, username, password, user;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body$user2 = req.body.user, username = _req$body$user2.username, password = _req$body$user2.password;
            _context2.prev = 1;

            if (!(!username || !password)) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context2.next = 6;
            return _User["default"].findOne({
              attributes: ["name", "lastname1", "lastname2", "username", "password", "token", "initialized"],
              where: {
                username: username
              },
              include: ["role"]
            });

          case 6:
            user = _context2.sent;
            _context2.t0 = user;

            if (!_context2.t0) {
              _context2.next = 12;
              break;
            }

            _context2.next = 11;
            return (0, _helpers.matchPassword)(password, user.password);

          case 11:
            _context2.t0 = _context2.sent;

          case 12:
            if (!_context2.t0) {
              _context2.next = 16;
              break;
            }

            (0, _responses.loginOk)(res, {
              name: user.name,
              lastname1: user.lastname1,
              lastname2: user.lastname2,
              username: user.username,
              token: user.token,
              initialized: user.initialized
            });
            _context2.next = 17;
            break;

          case 16:
            (0, _responses.incorrectCredentialsError)(res);

          case 17:
            _context2.next = 22;
            break;

          case 19:
            _context2.prev = 19;
            _context2.t1 = _context2["catch"](1);
            (0, _responses.serverError)(res, _context2.t1);

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 19]]);
  }));
  return _loginUser.apply(this, arguments);
}

function data(_x5, _x6) {
  return _data.apply(this, arguments);
}

function _data() {
  _data = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var user;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (req.headers.token) {
              _context3.next = 2;
              break;
            }

            return _context3.abrupt("return", res.send());

          case 2:
            _context3.prev = 2;
            _context3.next = 5;
            return _User["default"].findOne({
              attributes: ["name", "lastname1", "lastname2", "username", "token", "initialized"],
              where: {
                token: req.headers.token
              },
              include: ["role"]
            });

          case 5:
            user = _context3.sent;

            if (user) {
              (0, _responses.loginOk)(res, user);
            } else {
              (0, _responses.incorrectToken)(res);
            }

            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](2);
            (0, _responses.serverError)(res, _context3.t0);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 9]]);
  }));
  return _data.apply(this, arguments);
}

function changePassword(_x7, _x8) {
  return _changePassword.apply(this, arguments);
}

function _changePassword() {
  _changePassword = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var _req$body$user3, username, password, newPassword, user;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$body$user3 = req.body.user, username = _req$body$user3.username, password = _req$body$user3.password, newPassword = _req$body$user3.newPassword;
            _context4.prev = 1;

            if (!(!username || !password || !newPassword)) {
              _context4.next = 4;
              break;
            }

            return _context4.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context4.next = 6;
            return _User["default"].findOne({
              attributes: ["id", "name", "lastname1", "lastname2", "username", "token", "password", "initialized", "roleId"],
              where: {
                username: username
              }
            });

          case 6:
            user = _context4.sent;
            _context4.t0 = user;

            if (!_context4.t0) {
              _context4.next = 12;
              break;
            }

            _context4.next = 11;
            return (0, _helpers.matchPassword)(password, user.password);

          case 11:
            _context4.t0 = _context4.sent;

          case 12:
            if (!_context4.t0) {
              _context4.next = 23;
              break;
            }

            _context4.t1 = user;
            _context4.next = 16;
            return (0, _helpers.encryptPassword)(newPassword);

          case 16:
            _context4.t2 = _context4.sent;
            _context4.t3 = {
              password: _context4.t2,
              initialized: true
            };
            _context4.next = 20;
            return _context4.t1.update.call(_context4.t1, _context4.t3);

          case 20:
            (0, _responses.updatePassOk)(res);
            _context4.next = 24;
            break;

          case 23:
            (0, _responses.incorrectCredentialsError)(res);

          case 24:
            _context4.next = 29;
            break;

          case 26:
            _context4.prev = 26;
            _context4.t4 = _context4["catch"](1);
            (0, _responses.serverError)(res, _context4.t4);

          case 29:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 26]]);
  }));
  return _changePassword.apply(this, arguments);
}

function resetPassword(_x9, _x10) {
  return _resetPassword.apply(this, arguments);
}

function _resetPassword() {
  _resetPassword = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var username, user;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            username = req.body.user.username;
            _context5.prev = 1;

            if (username) {
              _context5.next = 4;
              break;
            }

            return _context5.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context5.next = 6;
            return _User["default"].findOne({
              attributes: ["id", "roleId", "name", "lastname1", "lastname2", "username", "token", "password", "initialized"],
              where: {
                username: username
              }
            });

          case 6:
            user = _context5.sent;

            if (!user) {
              _context5.next = 18;
              break;
            }

            _context5.t0 = user;
            _context5.next = 11;
            return (0, _helpers.encryptPassword)(process.env.TEMP_PASS);

          case 11:
            _context5.t1 = _context5.sent;
            _context5.t2 = {
              password: _context5.t1,
              initialized: false
            };
            _context5.next = 15;
            return _context5.t0.update.call(_context5.t0, _context5.t2);

          case 15:
            (0, _responses.userResetOk)(res, user);
            _context5.next = 19;
            break;

          case 18:
            (0, _responses.nonExistUsernameError)(res);

          case 19:
            _context5.next = 24;
            break;

          case 21:
            _context5.prev = 21;
            _context5.t3 = _context5["catch"](1);
            (0, _responses.serverError)(res, _context5.t3);

          case 24:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 21]]);
  }));
  return _resetPassword.apply(this, arguments);
}

function getTeachers(_x11, _x12) {
  return _getTeachers.apply(this, arguments);
}

function _getTeachers() {
  _getTeachers = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var teachers;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;

            if (req.headers.token) {
              _context6.next = 3;
              break;
            }

            return _context6.abrupt("return", (0, _responses.privilegesError)(res));

          case 3:
            _context6.next = 5;
            return _User["default"].findAll({
              attributes: ["id", "name", "lastname1", "lastname2", "username"],
              where: {
                roleId: 2
              }
            });

          case 5:
            teachers = _context6.sent;
            if (teachers) (0, _responses.usersOk)(res, teachers);
            _context6.next = 12;
            break;

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6["catch"](0);
            (0, _responses.serverError)(res, _context6.t0);

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 9]]);
  }));
  return _getTeachers.apply(this, arguments);
}

function getStudents(_x13, _x14) {
  return _getStudents.apply(this, arguments);
}

function _getStudents() {
  _getStudents = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
    var students;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.t0 = !req.headers.token;

            if (_context7.t0) {
              _context7.next = 6;
              break;
            }

            _context7.next = 5;
            return (0, _helpers.checkRolePrivilege)(req.headers.token, "teacher");

          case 5:
            _context7.t0 = !_context7.sent;

          case 6:
            if (!_context7.t0) {
              _context7.next = 8;
              break;
            }

            return _context7.abrupt("return", (0, _responses.privilegesError)(res));

          case 8:
            _context7.next = 10;
            return _User["default"].findAll({
              attributes: ["id", "name", "lastname1", "lastname2", "username"],
              where: {
                roleId: 3
              }
            });

          case 10:
            students = _context7.sent;
            if (students) (0, _responses.usersOk)(res, students);
            _context7.next = 17;
            break;

          case 14:
            _context7.prev = 14;
            _context7.t1 = _context7["catch"](0);
            (0, _responses.serverError)(res, _context7.t1);

          case 17:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 14]]);
  }));
  return _getStudents.apply(this, arguments);
}

function getStudentsByTeacherClass(_x15, _x16) {
  return _getStudentsByTeacherClass.apply(this, arguments);
}

function _getStudentsByTeacherClass() {
  _getStudentsByTeacherClass = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
    var students;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.t0 = !req.headers.token;

            if (_context8.t0) {
              _context8.next = 6;
              break;
            }

            _context8.next = 5;
            return (0, _helpers.checkRolePrivilege)(req.headers.token, "student");

          case 5:
            _context8.t0 = !_context8.sent;

          case 6:
            if (!_context8.t0) {
              _context8.next = 8;
              break;
            }

            return _context8.abrupt("return", (0, _responses.privilegesError)(res));

          case 8:
            _context8.next = 10;
            return _User["default"].findAll({
              attributes: ["name", "lastname1", "lastname2", "username", "id"],
              where: {
                roleId: 3
              },
              include: [_Class["default"], {
                model: _Class["default"],
                include: [_Year["default"]]
              }]
            });

          case 10:
            students = _context8.sent;
            if (students) (0, _responses.usersOk)(res, students);
            _context8.next = 17;
            break;

          case 14:
            _context8.prev = 14;
            _context8.t1 = _context8["catch"](0);
            (0, _responses.serverError)(res, _context8.t1);

          case 17:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 14]]);
  }));
  return _getStudentsByTeacherClass.apply(this, arguments);
}

function deleteUser(_x17, _x18) {
  return _deleteUser.apply(this, arguments);
}

function _deleteUser() {
  _deleteUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res) {
    var id;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            id = req.params.id;
            _context10.prev = 1;

            if (id) {
              _context10.next = 4;
              break;
            }

            return _context10.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context10.next = 6;
            return _database.sequelize.transaction( /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _context9.next = 2;
                        return _User_Class["default"].destroy({
                          where: {
                            userId: id
                          }
                        }, {
                          transaction: t
                        });

                      case 2:
                        _context9.next = 4;
                        return _Answer["default"].destroy({
                          where: {
                            userId: id
                          }
                        }, {
                          transaction: t
                        });

                      case 4:
                        _context9.next = 6;
                        return _Questionnaire["default"].update({
                          userId: 1
                        }, {
                          where: {
                            userId: id
                          }
                        }, {
                          transaction: t
                        });

                      case 6:
                        _context9.next = 8;
                        return _User["default"].destroy({
                          where: {
                            id: id
                          }
                        }, {
                          transaction: t
                        });

                      case 8:
                        return _context9.abrupt("return", (0, _responses.userDeletedOk)(res));

                      case 9:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              }));

              return function (_x19) {
                return _ref.apply(this, arguments);
              };
            }());

          case 6:
            _context10.next = 11;
            break;

          case 8:
            _context10.prev = 8;
            _context10.t0 = _context10["catch"](1);
            (0, _responses.serverError)(res, _context10.t0);

          case 11:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[1, 8]]);
  }));
  return _deleteUser.apply(this, arguments);
}