"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _subject = require("../controllers/subject.controller");

var _helpers = require("../util/helpers");

var _responses = require("../util/responses");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = (0, _express.Router)();
/**
 * Middleware for routes only accessible by admin.
 */

router.use("/adm", /*#__PURE__*/function () {
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
            _context.next = 12;
            break;

          case 4:
            _context.next = 6;
            return (0, _helpers.getRoleByToken)(req.headers.token);

          case 6:
            _context.t0 = _context.sent.dataValues.name;

            if (!(_context.t0 == "admin")) {
              _context.next = 11;
              break;
            }

            next();
            _context.next = 12;
            break;

          case 11:
            (0, _responses.privilegesError)(res);

          case 12:
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
router.get("/", _subject.getSubjects);
router.get("/enabled", _subject.getEnabledSubjects);
router.put("/adm/edit", _subject.updateSubject);
router.post("/adm/add", _subject.createSubject);
var _default = router;
exports["default"] = _default;