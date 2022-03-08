"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _questionnaire = require("../controllers/questionnaire.controller");

var _helpers = require("../util/helpers");

var _responses = require("../util/responses");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = (0, _express.Router)();
/**
 * Middleware for routes only accessible by teachers.
 */

router.use("/tch", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var _yield$getRoleByToken;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.headers.token) {
              _context.next = 4;
              break;
            }

            (0, _responses.badRequestError)(res);
            _context.next = 21;
            break;

          case 4:
            _context.next = 6;
            return (0, _helpers.getRoleByToken)(req.headers.token);

          case 6:
            _context.t1 = _yield$getRoleByToken = _context.sent.dataValues;
            _context.t0 = _context.t1 === null;

            if (_context.t0) {
              _context.next = 10;
              break;
            }

            _context.t0 = _yield$getRoleByToken === void 0;

          case 10:
            if (!_context.t0) {
              _context.next = 14;
              break;
            }

            _context.t2 = void 0;
            _context.next = 15;
            break;

          case 14:
            _context.t2 = _yield$getRoleByToken.name;

          case 15:
            _context.t3 = _context.t2;

            if (!(_context.t3 == "teacher")) {
              _context.next = 20;
              break;
            }

            next();
            _context.next = 21;
            break;

          case 20:
            (0, _responses.privilegesError)(res);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get("/tch", _questionnaire.getQuestionnairesForTeachers);
router.get("/std", _questionnaire.getQuestionnairesForStudents);
router.get("/tch/questionnaire/:id", _questionnaire.getQuestionnaireForTeacher);
router.get("/std/questionnaire/:id", _questionnaire.getQuestionnaireForStudent);
router.get("/std/revision/:id", _questionnaire.getRevisionForStudent);
router.post("/std/correct", _questionnaire.correctQuestionnaire);
router.post("/tch/add", _questionnaire.createQuestionnaire);
router.get("/std/user/:id/grades", _questionnaire.getGradesByUser);
router.put("/tch/update", _questionnaire.updateQuestionnaire);
router.patch("/tch/change_visible", _questionnaire.changeVisibility);
router.patch("/tch/change_reviewable", _questionnaire.changeReviewable);
router.patch("/tch/change_can_remake", _questionnaire.changeRemake);
router.patch("/tch/change_view_grade", _questionnaire.changeViewgrade);
router["delete"]("/tch/delete/:id", _questionnaire.deleteQuestionnaire);
router.get("/tch/questionnaire/:id/grades", _questionnaire.getGradesByQuestionnaire);
var _default = router;
exports["default"] = _default;