"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createQuestionnaire = createQuestionnaire;
exports.updateQuestionnaire = updateQuestionnaire;
exports.getQuestionnairesForTeachers = getQuestionnairesForTeachers;
exports.getQuestionnairesForStudents = getQuestionnairesForStudents;
exports.changeVisibility = changeVisibility;
exports.changeReviewable = changeReviewable;
exports.changeRemake = changeRemake;
exports.changeViewgrade = changeViewgrade;
exports.deleteQuestionnaire = deleteQuestionnaire;
exports.getQuestionnaireForTeacher = getQuestionnaireForTeacher;
exports.getGradesByQuestionnaire = getGradesByQuestionnaire;
exports.getQuestionnaireForStudent = getQuestionnaireForStudent;
exports.getRevisionForStudent = getRevisionForStudent;
exports.correctQuestionnaire = correctQuestionnaire;
exports.getGradesByUser = getGradesByUser;

var _nodeEnvFile = _interopRequireDefault(require("node-env-file"));

var _Class = _interopRequireDefault(require("../models/Class"));

var _User = _interopRequireDefault(require("../models/User"));

var _Year = _interopRequireDefault(require("../models/Year"));

var _responses = require("../util/responses");

var _database = require("../database/database");

var _helpers = require("../util/helpers");

var _Questionnaire = _interopRequireDefault(require("../models/Questionnaire"));

var _Questionnaire_Class = _interopRequireDefault(require("../models/Questionnaire_Class"));

var _User_Class = _interopRequireDefault(require("../models/User_Class"));

var _Subject = _interopRequireDefault(require("../models/Subject"));

var _Answer = _interopRequireDefault(require("../models/Answer"));

var _sequelize = require("sequelize");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(0, _nodeEnvFile["default"])(__dirname + "/../../.env");

function createQuestionnaire(_x, _x2) {
  return _createQuestionnaire.apply(this, arguments);
}

function _createQuestionnaire() {
  _createQuestionnaire = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$body, classes, info, questions, user;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _req$body = req.body, classes = _req$body.classes, info = _req$body.info, questions = _req$body.questions;
            _context2.next = 4;
            return (0, _helpers.getUserByToken)(req.headers.token);

          case 4:
            user = _context2.sent;

            if (!(!classes || !info || !questions || !user)) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", (0, _responses.badRequestError)(res));

          case 7:
            _context2.next = 9;
            return _database.sequelize.transaction( /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
                var questionnaire, _iterator, _step, auxClass;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _Questionnaire["default"].create({
                          userId: user.id,
                          subjectId: parseInt(info.subject),
                          title: info.title,
                          visible: false,
                          raw_data: JSON.stringify(questions),
                          student_data: JSON.stringify((0, _helpers.getStudentData)(questions))
                        }, {
                          transaction: t
                        });

                      case 2:
                        questionnaire = _context.sent;
                        _iterator = _createForOfIteratorHelper(classes);
                        _context.prev = 4;

                        _iterator.s();

                      case 6:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 12;
                          break;
                        }

                        auxClass = _step.value;
                        _context.next = 10;
                        return _Questionnaire_Class["default"].create({
                          questionnaireId: questionnaire.id,
                          classId: auxClass.classId
                        }, {
                          transaction: t
                        });

                      case 10:
                        _context.next = 6;
                        break;

                      case 12:
                        _context.next = 17;
                        break;

                      case 14:
                        _context.prev = 14;
                        _context.t0 = _context["catch"](4);

                        _iterator.e(_context.t0);

                      case 17:
                        _context.prev = 17;

                        _iterator.f();

                        return _context.finish(17);

                      case 20:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[4, 14, 17, 20]]);
              }));

              return function (_x31) {
                return _ref.apply(this, arguments);
              };
            }());

          case 9:
            (0, _responses.questionnaireCreatedOk)(res);
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](0);
            _context2.t0.original && _context2.t0.original.code == "ER_DUP_ENTRY" ? (0, _responses.duplicateClassError)(res) : (0, _responses.serverError)(res, _context2.t0);

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 12]]);
  }));
  return _createQuestionnaire.apply(this, arguments);
}

function updateQuestionnaire(_x3, _x4) {
  return _updateQuestionnaire.apply(this, arguments);
}

function _updateQuestionnaire() {
  _updateQuestionnaire = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var _req$body2, classes, info, questions, user;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _req$body2 = req.body, classes = _req$body2.classes, info = _req$body2.info, questions = _req$body2.questions;
            _context4.next = 4;
            return (0, _helpers.getUserByToken)(req.headers.token);

          case 4:
            user = _context4.sent;

            if (!(!classes || !info || !info.id || !questions || !user)) {
              _context4.next = 7;
              break;
            }

            return _context4.abrupt("return", (0, _responses.badRequestError)(res));

          case 7:
            _context4.next = 9;
            return _database.sequelize.transaction( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
                var _iterator2, _step2, auxClass;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return _Questionnaire["default"].update({
                          subjectId: parseInt(info.subject),
                          title: info.title,
                          raw_data: JSON.stringify(questions),
                          student_data: JSON.stringify((0, _helpers.getStudentData)(questions))
                        }, {
                          where: {
                            id: info.id
                          },
                          transaction: t
                        });

                      case 2:
                        _context3.next = 4;
                        return _Questionnaire_Class["default"].destroy({
                          where: {
                            questionnaireId: info.id
                          },
                          transaction: t
                        });

                      case 4:
                        _context3.next = 6;
                        return _Answer["default"].destroy({
                          where: {
                            questionnaireId: info.id
                          },
                          transaction: t
                        });

                      case 6:
                        _iterator2 = _createForOfIteratorHelper(classes);
                        _context3.prev = 7;

                        _iterator2.s();

                      case 9:
                        if ((_step2 = _iterator2.n()).done) {
                          _context3.next = 15;
                          break;
                        }

                        auxClass = _step2.value;
                        _context3.next = 13;
                        return _Questionnaire_Class["default"].create({
                          questionnaireId: info.id,
                          classId: auxClass.classId
                        }, {
                          transaction: t
                        });

                      case 13:
                        _context3.next = 9;
                        break;

                      case 15:
                        _context3.next = 20;
                        break;

                      case 17:
                        _context3.prev = 17;
                        _context3.t0 = _context3["catch"](7);

                        _iterator2.e(_context3.t0);

                      case 20:
                        _context3.prev = 20;

                        _iterator2.f();

                        return _context3.finish(20);

                      case 23:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[7, 17, 20, 23]]);
              }));

              return function (_x32) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 9:
            (0, _responses.questionnaireCreatedOk)(res);
            _context4.next = 15;
            break;

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](0);
            _context4.t0.original && _context4.t0.original.code == "ER_DUP_ENTRY" ? (0, _responses.duplicateClassError)(res) : (0, _responses.serverError)(res, _context4.t0);

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 12]]);
  }));
  return _updateQuestionnaire.apply(this, arguments);
}

function getQuestionnairesForTeachers(_x5, _x6) {
  return _getQuestionnairesForTeachers.apply(this, arguments);
}

function _getQuestionnairesForTeachers() {
  _getQuestionnairesForTeachers = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var questionnaires, user, auxQuestionnaires;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;

            if (req.headers.token) {
              _context5.next = 3;
              break;
            }

            return _context5.abrupt("return", (0, _responses.privilegesError)(res));

          case 3:
            _context5.next = 5;
            return _Questionnaire["default"].findAll({
              attributes: ["id", "title", "visible", "reviewable", "can_remake", "view_grade", "created_at"],
              include: [_Subject["default"], {
                model: _Questionnaire_Class["default"],
                include: [{
                  model: _Class["default"],
                  include: [_Year["default"]]
                }]
              }, {
                model: _User["default"],
                attributes: ["id"]
              }]
            });

          case 5:
            questionnaires = _context5.sent;
            _context5.next = 8;
            return (0, _helpers.getUserByToken)(req.headers.token);

          case 8:
            user = _context5.sent;
            auxQuestionnaires = [];
            questionnaires.forEach(function (questionnaire) {
              if (questionnaire.user.id == user.id) {
                var auxQuestionnaire = _objectSpread({}, questionnaire.dataValues);

                auxQuestionnaire.owner = true;
                auxQuestionnaires.push(auxQuestionnaire);
              } else {
                var _auxQuestionnaire = _objectSpread({}, questionnaire.dataValues);

                _auxQuestionnaire.owner = false;
                auxQuestionnaires.push(_auxQuestionnaire);
              }
            });

            if (auxQuestionnaires) {
              (0, _responses.getQuestionnairesForTeachersOk)(res, auxQuestionnaires);
            }

            _context5.next = 17;
            break;

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5["catch"](0);
            (0, _responses.serverError)(res, _context5.t0);

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 14]]);
  }));
  return _getQuestionnairesForTeachers.apply(this, arguments);
}

function getQuestionnairesForStudents(_x7, _x8) {
  return _getQuestionnairesForStudents.apply(this, arguments);
}

function _getQuestionnairesForStudents() {
  _getQuestionnairesForStudents = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var user, classIds, auxClassIds, questionnaireClasses, questionnaireIds, questionnaires, auxQuestionnaires, _iterator3, _step3, e, grades;

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
            return (0, _helpers.getUserByToken)(req.headers.token);

          case 5:
            user = _context6.sent;

            if (user) {
              _context6.next = 8;
              break;
            }

            return _context6.abrupt("return", (0, _responses.privilegesError)(res));

          case 8:
            _context6.next = 10;
            return _User_Class["default"].findAll({
              where: {
                type: "AL",
                userId: user.id
              },
              attributes: ["classId"]
            });

          case 10:
            classIds = _context6.sent;
            auxClassIds = [];
            classIds.forEach(function (cid) {
              auxClassIds.push(cid.classId);
            });
            _context6.next = 15;
            return _Questionnaire_Class["default"].findAll({
              where: {
                classId: _defineProperty({}, _sequelize.Op["in"], auxClassIds)
              }
            });

          case 15:
            questionnaireClasses = _context6.sent;
            questionnaireIds = [];
            questionnaireClasses.forEach(function (qid) {
              questionnaireIds.push(qid.questionnaireId);
            });
            _context6.next = 20;
            return _Questionnaire["default"].findAll({
              attributes: ["id", "title", "reviewable", "can_remake", "view_grade"],
              include: [_Subject["default"]],
              where: {
                visible: true,
                id: _defineProperty({}, _sequelize.Op["in"], questionnaireIds)
              }
            });

          case 20:
            questionnaires = _context6.sent;
            auxQuestionnaires = [];
            _iterator3 = _createForOfIteratorHelper(questionnaires);
            _context6.prev = 23;

            _iterator3.s();

          case 25:
            if ((_step3 = _iterator3.n()).done) {
              _context6.next = 33;
              break;
            }

            e = _step3.value;
            _context6.next = 29;
            return _Answer["default"].findAll({
              order: [['created_at', 'DESC']],
              attributes: ["id", "grade", "total_questions", "questions_answered", "created_at"],
              where: {
                questionnaireId: e.id,
                userId: user.id
              }
            });

          case 29:
            grades = _context6.sent;
            auxQuestionnaires.push(_objectSpread(_objectSpread({}, e.dataValues), {}, {
              grades: grades
            }));

          case 31:
            _context6.next = 25;
            break;

          case 33:
            _context6.next = 38;
            break;

          case 35:
            _context6.prev = 35;
            _context6.t0 = _context6["catch"](23);

            _iterator3.e(_context6.t0);

          case 38:
            _context6.prev = 38;

            _iterator3.f();

            return _context6.finish(38);

          case 41:
            if (!questionnaires) {
              _context6.next = 43;
              break;
            }

            return _context6.abrupt("return", (0, _responses.getQuestionnairesForStudentsOk)(res, auxQuestionnaires));

          case 43:
            _context6.next = 48;
            break;

          case 45:
            _context6.prev = 45;
            _context6.t1 = _context6["catch"](0);
            return _context6.abrupt("return", (0, _responses.serverError)(res, _context6.t1));

          case 48:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 45], [23, 35, 38, 41]]);
  }));
  return _getQuestionnairesForStudents.apply(this, arguments);
}

function changeVisibility(_x9, _x10) {
  return _changeVisibility.apply(this, arguments);
}

function _changeVisibility() {
  _changeVisibility = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
    var _req$body3, value, id, questionnaire;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _req$body3 = req.body, value = _req$body3.value, id = _req$body3.id;
            _context7.prev = 1;

            if (!(value == undefined || !id)) {
              _context7.next = 4;
              break;
            }

            return _context7.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context7.next = 6;
            return _Questionnaire["default"].findOne({
              where: {
                id: id
              }
            });

          case 6:
            questionnaire = _context7.sent;

            if (!questionnaire) {
              _context7.next = 13;
              break;
            }

            _context7.next = 10;
            return questionnaire.update({
              visible: value
            });

          case 10:
            (0, _responses.questionnaireUpdatedOk)(res);
            _context7.next = 14;
            break;

          case 13:
            incorrectCredentialsError(res);

          case 14:
            _context7.next = 19;
            break;

          case 16:
            _context7.prev = 16;
            _context7.t0 = _context7["catch"](1);
            (0, _responses.serverError)(res, _context7.t0);

          case 19:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 16]]);
  }));
  return _changeVisibility.apply(this, arguments);
}

function changeReviewable(_x11, _x12) {
  return _changeReviewable.apply(this, arguments);
}

function _changeReviewable() {
  _changeReviewable = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
    var _req$body4, value, id, questionnaire;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _req$body4 = req.body, value = _req$body4.value, id = _req$body4.id;
            _context8.prev = 1;

            if (!(value == undefined || !id)) {
              _context8.next = 4;
              break;
            }

            return _context8.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context8.next = 6;
            return _Questionnaire["default"].findOne({
              where: {
                id: id
              }
            });

          case 6:
            questionnaire = _context8.sent;

            if (!questionnaire) {
              _context8.next = 13;
              break;
            }

            _context8.next = 10;
            return questionnaire.update({
              reviewable: value
            });

          case 10:
            (0, _responses.questionnaireUpdatedOk)(res);
            _context8.next = 14;
            break;

          case 13:
            incorrectCredentialsError(res);

          case 14:
            _context8.next = 19;
            break;

          case 16:
            _context8.prev = 16;
            _context8.t0 = _context8["catch"](1);
            (0, _responses.serverError)(res, _context8.t0);

          case 19:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[1, 16]]);
  }));
  return _changeReviewable.apply(this, arguments);
}

function changeRemake(_x13, _x14) {
  return _changeRemake.apply(this, arguments);
}

function _changeRemake() {
  _changeRemake = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res) {
    var _req$body5, value, id, questionnaire;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _req$body5 = req.body, value = _req$body5.value, id = _req$body5.id;
            _context9.prev = 1;

            if (!(value == undefined || !id)) {
              _context9.next = 4;
              break;
            }

            return _context9.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context9.next = 6;
            return _Questionnaire["default"].findOne({
              where: {
                id: id
              }
            });

          case 6:
            questionnaire = _context9.sent;

            if (!questionnaire) {
              _context9.next = 13;
              break;
            }

            _context9.next = 10;
            return questionnaire.update({
              can_remake: value
            });

          case 10:
            (0, _responses.questionnaireUpdatedOk)(res);
            _context9.next = 14;
            break;

          case 13:
            incorrectCredentialsError(res);

          case 14:
            _context9.next = 19;
            break;

          case 16:
            _context9.prev = 16;
            _context9.t0 = _context9["catch"](1);
            (0, _responses.serverError)(res, _context9.t0);

          case 19:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[1, 16]]);
  }));
  return _changeRemake.apply(this, arguments);
}

function changeViewgrade(_x15, _x16) {
  return _changeViewgrade.apply(this, arguments);
}

function _changeViewgrade() {
  _changeViewgrade = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res) {
    var _req$body6, value, id, questionnaire;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _req$body6 = req.body, value = _req$body6.value, id = _req$body6.id;
            _context10.prev = 1;

            if (!(value == undefined || !id)) {
              _context10.next = 4;
              break;
            }

            return _context10.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context10.next = 6;
            return _Questionnaire["default"].findOne({
              where: {
                id: id
              }
            });

          case 6:
            questionnaire = _context10.sent;

            if (!questionnaire) {
              _context10.next = 13;
              break;
            }

            _context10.next = 10;
            return questionnaire.update({
              view_grade: value
            });

          case 10:
            (0, _responses.questionnaireUpdatedOk)(res);
            _context10.next = 14;
            break;

          case 13:
            incorrectCredentialsError(res);

          case 14:
            _context10.next = 19;
            break;

          case 16:
            _context10.prev = 16;
            _context10.t0 = _context10["catch"](1);
            (0, _responses.serverError)(res, _context10.t0);

          case 19:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[1, 16]]);
  }));
  return _changeViewgrade.apply(this, arguments);
}

function deleteQuestionnaire(_x17, _x18) {
  return _deleteQuestionnaire.apply(this, arguments);
}

function _deleteQuestionnaire() {
  _deleteQuestionnaire = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(req, res) {
    var id;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            id = req.params.id;
            _context12.prev = 1;

            if (id) {
              _context12.next = 4;
              break;
            }

            return _context12.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context12.next = 6;
            return _database.sequelize.transaction( /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return _Questionnaire["default"].destroy({
                          where: {
                            id: id
                          }
                        }, {
                          transaction: t
                        });

                      case 2:
                        _context11.next = 4;
                        return _Questionnaire_Class["default"].destroy({
                          where: {
                            questionnaireId: id
                          }
                        }, {
                          transaction: t
                        });

                      case 4:
                        _context11.next = 6;
                        return _Answer["default"].destroy({
                          where: {
                            questionnaireId: id
                          }
                        }, {
                          transaction: t
                        });

                      case 6:
                        (0, _responses.questionnaireDeletedOk)(res);

                      case 7:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11);
              }));

              return function (_x33) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 6:
            _context12.next = 11;
            break;

          case 8:
            _context12.prev = 8;
            _context12.t0 = _context12["catch"](1);
            (0, _responses.serverError)(res, _context12.t0);

          case 11:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[1, 8]]);
  }));
  return _deleteQuestionnaire.apply(this, arguments);
}

function getQuestionnaireForTeacher(_x19, _x20) {
  return _getQuestionnaireForTeacher.apply(this, arguments);
}

function _getQuestionnaireForTeacher() {
  _getQuestionnaireForTeacher = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(req, res) {
    var id, questionnaire;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            id = req.params.id;
            _context13.prev = 1;

            if (id) {
              _context13.next = 4;
              break;
            }

            return _context13.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context13.next = 6;
            return _Questionnaire["default"].findOne({
              where: {
                id: id
              },
              attributes: ["id", "userId", "raw_data", "title"],
              include: [_Subject["default"], _Questionnaire_Class["default"]]
            });

          case 6:
            questionnaire = _context13.sent;
            questionnaire.raw_data = JSON.parse(questionnaire.raw_data);
            if (questionnaire) (0, _responses.getQuestionnaireForTeachersOk)(res, questionnaire);
            _context13.next = 14;
            break;

          case 11:
            _context13.prev = 11;
            _context13.t0 = _context13["catch"](1);
            (0, _responses.serverError)(res, _context13.t0);

          case 14:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[1, 11]]);
  }));
  return _getQuestionnaireForTeacher.apply(this, arguments);
}

function getGradesByQuestionnaire(_x21, _x22) {
  return _getGradesByQuestionnaire.apply(this, arguments);
}

function _getGradesByQuestionnaire() {
  _getGradesByQuestionnaire = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(req, res) {
    var id, answers;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            id = req.params.id;
            _context14.prev = 1;

            if (id) {
              _context14.next = 4;
              break;
            }

            return _context14.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context14.next = 6;
            return _Answer["default"].findAll({
              where: {
                questionnaireId: id
              },
              attributes: ["grade", "questions_answered", "created_at"],
              include: [{
                model: _User["default"],
                attributes: ['name', 'lastname1', 'lastname2']
              }]
            });

          case 6:
            answers = _context14.sent;
            if (answers) (0, _responses.getGradesOk)(res, answers);
            _context14.next = 13;
            break;

          case 10:
            _context14.prev = 10;
            _context14.t0 = _context14["catch"](1);
            (0, _responses.serverError)(res, _context14.t0);

          case 13:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[1, 10]]);
  }));
  return _getGradesByQuestionnaire.apply(this, arguments);
}

function getQuestionnaireForStudent(_x23, _x24) {
  return _getQuestionnaireForStudent.apply(this, arguments);
}

function _getQuestionnaireForStudent() {
  _getQuestionnaireForStudent = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(req, res) {
    var id, user, questionnaire, authorize, userClasses, questionnaireClasses;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            id = req.params.id;
            _context15.prev = 1;

            if (req.headers.token) {
              _context15.next = 4;
              break;
            }

            return _context15.abrupt("return", (0, _responses.privilegesError)(res));

          case 4:
            _context15.next = 6;
            return (0, _helpers.getUserByToken)(req.headers.token);

          case 6:
            user = _context15.sent;

            if (user) {
              _context15.next = 9;
              break;
            }

            return _context15.abrupt("return", (0, _responses.privilegesError)(res));

          case 9:
            _context15.next = 11;
            return _Questionnaire["default"].findOne({
              attributes: ["id", "title", "student_data"],
              include: [_Subject["default"]],
              where: {
                id: id,
                visible: true
              }
            });

          case 11:
            questionnaire = _context15.sent;
            authorize = false;

            if (!(user.role.name === 'teacher')) {
              _context15.next = 17;
              break;
            }

            authorize = true;
            _context15.next = 28;
            break;

          case 17:
            _context15.next = 19;
            return _User_Class["default"].findAll({
              where: {
                userId: user.id,
                type: 'AL'
              }
            });

          case 19:
            userClasses = _context15.sent;
            _context15.next = 22;
            return _Questionnaire_Class["default"].findAll({
              where: {
                questionnaireId: questionnaire.id
              }
            });

          case 22:
            questionnaireClasses = _context15.sent;

            if (!(userClasses && questionnaireClasses)) {
              _context15.next = 27;
              break;
            }

            userClasses.forEach(function (uClass) {
              var aux = questionnaireClasses.find(function (qclass) {
                return uClass.classId === qclass.classId;
              });

              if (aux) {
                authorize = true;
              }
            });
            _context15.next = 28;
            break;

          case 27:
            return _context15.abrupt("return", (0, _responses.serverError)(res));

          case 28:
            if (!(authorize && questionnaire)) {
              _context15.next = 33;
              break;
            }

            questionnaire.student_data = (0, _helpers.shuffleQuestionnaire)(JSON.parse(questionnaire.student_data));
            return _context15.abrupt("return", (0, _responses.getQuestionnaireForStudentsOk)(res, questionnaire));

          case 33:
            return _context15.abrupt("return", (0, _responses.serverError)(res));

          case 34:
            _context15.next = 39;
            break;

          case 36:
            _context15.prev = 36;
            _context15.t0 = _context15["catch"](1);
            return _context15.abrupt("return", (0, _responses.serverError)(res, _context15.t0));

          case 39:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[1, 36]]);
  }));
  return _getQuestionnaireForStudent.apply(this, arguments);
}

function getRevisionForStudent(_x25, _x26) {
  return _getRevisionForStudent.apply(this, arguments);
}

function _getRevisionForStudent() {
  _getRevisionForStudent = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(req, res) {
    var id, user, answer;
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            id = req.params.id;
            _context16.prev = 1;

            if (req.headers.token) {
              _context16.next = 4;
              break;
            }

            return _context16.abrupt("return", (0, _responses.privilegesError)(res));

          case 4:
            _context16.next = 6;
            return (0, _helpers.getUserByToken)(req.headers.token);

          case 6:
            user = _context16.sent;

            if (user) {
              _context16.next = 9;
              break;
            }

            return _context16.abrupt("return", (0, _responses.privilegesError)(res));

          case 9:
            _context16.next = 11;
            return _Answer["default"].findOne({
              attributes: ["userId", "revision"],
              where: {
                id: id
              }
            });

          case 11:
            answer = _context16.sent;

            if (!(answer.userId === user.id)) {
              _context16.next = 16;
              break;
            }

            return _context16.abrupt("return", (0, _responses.getRevisionForStudentsOk)(res, answer.revision));

          case 16:
            return _context16.abrupt("return", (0, _responses.privilegesError)(res));

          case 17:
            _context16.next = 22;
            break;

          case 19:
            _context16.prev = 19;
            _context16.t0 = _context16["catch"](1);
            return _context16.abrupt("return", (0, _responses.serverError)(res, _context16.t0));

          case 22:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[1, 19]]);
  }));
  return _getRevisionForStudent.apply(this, arguments);
}

function correctQuestionnaire(_x27, _x28) {
  return _correctQuestionnaire.apply(this, arguments);
}

function _correctQuestionnaire() {
  _correctQuestionnaire = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(req, res) {
    var user, _req$body$questionnai, questions, id, questionnaireAnswers, correct, correction, grade;

    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.prev = 0;

            if (req.headers.token) {
              _context18.next = 3;
              break;
            }

            return _context18.abrupt("return", (0, _responses.privilegesError)(res));

          case 3:
            _context18.next = 5;
            return (0, _helpers.getUserByToken)(req.headers.token);

          case 5:
            user = _context18.sent;

            if (user) {
              _context18.next = 8;
              break;
            }

            return _context18.abrupt("return", (0, _responses.privilegesError)(res));

          case 8:
            _req$body$questionnai = req.body.questionnaire, questions = _req$body$questionnai.questions, id = _req$body$questionnai.id;

            if (!(!questions || !id)) {
              _context18.next = 11;
              break;
            }

            return _context18.abrupt("return", (0, _responses.serverError)(res));

          case 11:
            _context18.next = 13;
            return _Questionnaire["default"].findOne({
              attributes: ["id", "raw_data", "title"],
              where: {
                id: id
              }
            });

          case 13:
            questionnaireAnswers = _context18.sent;
            correct = (0, _helpers.correctQuestions)(questions, JSON.parse(questionnaireAnswers.raw_data));
            correction = {
              id: questionnaireAnswers.id,
              description_test: "Revisi\xF3n de \"".concat(questionnaireAnswers.title, "\""),
              questions_number: correct.length,
              question_id: -1,
              questions: correct
            };
            grade = correct.map(function (c) {
              return c.grade;
            }).reduce(function (c1, c2) {
              return c1 + c2;
            }) / (10 * questions.length);

            if (grade > 10) {
              grade = 10;
            }

            ;
            _context18.next = 21;
            return _database.sequelize.transaction( /*#__PURE__*/function () {
              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(t) {
                var answer;
                return regeneratorRuntime.wrap(function _callee17$(_context17) {
                  while (1) {
                    switch (_context17.prev = _context17.next) {
                      case 0:
                        _context17.next = 2;
                        return _Answer["default"].create({
                          userId: user.id,
                          questionnaireId: id,
                          visible: true,
                          grade: _round(grade),
                          total_questions: questions.length,
                          questions_answered: questions.filter(function (q) {
                            return q.answered;
                          }).length,
                          revision: JSON.stringify(correction)
                        }, {
                          transaction: t
                        });

                      case 2:
                        answer = _context17.sent;

                        if (!answer) {
                          _context17.next = 5;
                          break;
                        }

                        return _context17.abrupt("return", (0, _responses.answerCreateOk)(res));

                      case 5:
                      case "end":
                        return _context17.stop();
                    }
                  }
                }, _callee17);
              }));

              return function (_x34) {
                return _ref4.apply(this, arguments);
              };
            }());

          case 21:
            _context18.next = 26;
            break;

          case 23:
            _context18.prev = 23;
            _context18.t0 = _context18["catch"](0);
            return _context18.abrupt("return", (0, _responses.serverError)(res, _context18.t0));

          case 26:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, null, [[0, 23]]);
  }));
  return _correctQuestionnaire.apply(this, arguments);
}

function getGradesByUser(_x29, _x30) {
  return _getGradesByUser.apply(this, arguments);
}

function _getGradesByUser() {
  _getGradesByUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(req, res) {
    var id, answers;
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            id = req.params.id;
            _context19.prev = 1;

            if (id) {
              _context19.next = 4;
              break;
            }

            return _context19.abrupt("return", (0, _responses.badRequestError)(res));

          case 4:
            _context19.next = 6;
            return _Answer["default"].findAll({
              where: {
                userId: id
              },
              attributes: ["grade", "questions_answered", "created_at"],
              include: [{
                model: _User["default"],
                attributes: ['name', 'lastname1', 'lastname2']
              }]
            });

          case 6:
            answers = _context19.sent;
            if (answers) (0, _responses.getGradesOk)(res, answers);
            _context19.next = 13;
            break;

          case 10:
            _context19.prev = 10;
            _context19.t0 = _context19["catch"](1);
            (0, _responses.serverError)(res, _context19.t0);

          case 13:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, null, [[1, 10]]);
  }));
  return _getGradesByUser.apply(this, arguments);
}

var _round = function _round(num) {
  var m = Number((Math.abs(num) * 100).toPrecision(15));
  return Math.round(m) / 100 * Math.sign(num);
};