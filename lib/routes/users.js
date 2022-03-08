"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _user = require("../controllers/user.controller");

var _helpers = require("../util/helpers");

var _responses = require("../util/responses");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = (0, _express.Router)();
router.use("/r1", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.headers.token) {
              _context.next = 4;
              break;
            }

            (0, _responses.badRequestError)(res);
            _context.next = 11;
            break;

          case 4:
            _context.next = 6;
            return (0, _helpers.checkRolePrivilege)(req.headers.token, req.body.user.role);

          case 6:
            if (!_context.sent) {
              _context.next = 10;
              break;
            }

            next();
            _context.next = 11;
            break;

          case 10:
            (0, _responses.privilegesError)(res);

          case 11:
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
router.use("/adm", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var _yield$getRoleByToken, _yield$getRoleByToken2;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (req.headers.token) {
              _context2.next = 4;
              break;
            }

            (0, _responses.badRequestError)(res);
            _context2.next = 21;
            break;

          case 4:
            _context2.next = 6;
            return (0, _helpers.getRoleByToken)(req.headers.token);

          case 6:
            _context2.t1 = _yield$getRoleByToken = _context2.sent;
            _context2.t0 = _context2.t1 === null;

            if (_context2.t0) {
              _context2.next = 10;
              break;
            }

            _context2.t0 = _yield$getRoleByToken === void 0;

          case 10:
            if (!_context2.t0) {
              _context2.next = 14;
              break;
            }

            _context2.t2 = void 0;
            _context2.next = 15;
            break;

          case 14:
            _context2.t2 = (_yield$getRoleByToken2 = _yield$getRoleByToken.dataValues) === null || _yield$getRoleByToken2 === void 0 ? void 0 : _yield$getRoleByToken2.name;

          case 15:
            _context2.t3 = _context2.t2;

            if (!(_context2.t3 === "admin")) {
              _context2.next = 20;
              break;
            }

            next();
            _context2.next = 21;
            break;

          case 20:
            (0, _responses.privilegesError)(res);

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.post("/r1/create", _user.createUser);
router.post("/login", _user.loginUser);
router.post("/data", _user.data);
router.post("/change_password", _user.changePassword);
router.post("/adm/reset_password", _user.resetPassword);
router["delete"]("/adm/:id", _user.deleteUser);
router.get("/adm/teachers", _user.getTeachers);
router.get("/students", _user.getStudents);
router.get("/students_by_class", _user.getStudentsByTeacherClass);
var _default = router;
exports["default"] = _default;