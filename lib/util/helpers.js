"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encryptPassword = encryptPassword;
exports.matchPassword = matchPassword;
exports.validateApiKey = validateApiKey;
exports.checkRolePrivilege = checkRolePrivilege;
exports.getRoleByToken = getRoleByToken;
exports.getUserByToken = getUserByToken;
exports.getStudentData = getStudentData;
exports._shuffleMonoTest = exports.shuffleQuestionnaire = exports.correctQuestions = void 0;

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _nodeEnvFile = _interopRequireDefault(require("node-env-file"));

var _Role = _interopRequireDefault(require("../models/Role"));

var _User = _interopRequireDefault(require("../models/User"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(0, _nodeEnvFile["default"])(__dirname + "/../../.env");

function encryptPassword(_x) {
  return _encryptPassword.apply(this, arguments);
}

function _encryptPassword() {
  _encryptPassword = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(password) {
    var salt, hash;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _bcryptjs["default"].genSalt(10);

          case 2:
            salt = _context.sent;
            _context.next = 5;
            return _bcryptjs["default"].hash(password, salt);

          case 5:
            hash = _context.sent;
            return _context.abrupt("return", hash);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _encryptPassword.apply(this, arguments);
}

function matchPassword(_x2, _x3) {
  return _matchPassword.apply(this, arguments);
}

function _matchPassword() {
  _matchPassword = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(password, savePassword) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _bcryptjs["default"].compare(password, savePassword);

          case 3:
            return _context2.abrupt("return", _context2.sent);

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 6]]);
  }));
  return _matchPassword.apply(this, arguments);
}

function validateApiKey(api_key) {
  return api_key == process.env.API_KEY;
}

function checkRolePrivilege(_x4, _x5) {
  return _checkRolePrivilege.apply(this, arguments);
}

function _checkRolePrivilege() {
  _checkRolePrivilege = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(token, targetRole) {
    var actualRole;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getRoleByToken(token);

          case 2:
            actualRole = _context3.sent;

            if (!(actualRole == null)) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return", false);

          case 7:
            if (!(targetRole == "teacher")) {
              _context3.next = 11;
              break;
            }

            return _context3.abrupt("return", actualRole.name == "admin");

          case 11:
            if (!(targetRole == "student")) {
              _context3.next = 13;
              break;
            }

            return _context3.abrupt("return", actualRole.name == "admin" || actualRole.name == "teacher");

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _checkRolePrivilege.apply(this, arguments);
}

function getRoleByToken(_x6) {
  return _getRoleByToken.apply(this, arguments);
}

function _getRoleByToken() {
  _getRoleByToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(token) {
    var o;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _User["default"].findOne({
              where: {
                token: token
              },
              include: [_Role["default"]]
            });

          case 2:
            o = _context4.sent;

            if (!o) {
              _context4.next = 7;
              break;
            }

            return _context4.abrupt("return", o.role);

          case 7:
            return _context4.abrupt("return", null);

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getRoleByToken.apply(this, arguments);
}

function getUserByToken(_x7) {
  return _getUserByToken.apply(this, arguments);
}

function _getUserByToken() {
  _getUserByToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(token) {
    var o;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _User["default"].findOne({
              where: {
                token: token
              },
              include: [_Role["default"]]
            });

          case 2:
            o = _context5.sent;

            if (!o) {
              _context5.next = 7;
              break;
            }

            return _context5.abrupt("return", o);

          case 7:
            return _context5.abrupt("return", null);

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _getUserByToken.apply(this, arguments);
}

function getStudentData(questions) {
  var auxQuestions = [];
  questions.forEach(function (question, index) {
    var validQuestion;

    switch (question.type) {
      case "MONO_TEST":
        validQuestion = _validateMonoTest(question, index);
        break;

      case "MULTI_TEST":
        validQuestion = _validateMultiTest(question, index);
        break;

      case "FILL_TEXT":
        validQuestion = _validateFillText(question, index);
        break;

      case "DROPDOWN_SELECT":
        validQuestion = _validateDropdownSelect(question, index);
        break;

      case "FILL_DROPDOWN":
        validQuestion = _validateFillDropdown(question, index);
        break;

      case "DRAG_CATEGORIES":
        validQuestion = _validateDragCategories(question, index);
        break;

      case "DRAG_CATEGORIES_IMG":
        validQuestion = _validateDragCategoriesImg(question, index);
        break;

      case "JOIN_DRAG":
        validQuestion = _validateJoinDrag(question, index);
        break;

      case "JOIN_DRAG_IMG":
        validQuestion = _validateJoinDragImg(question, index);
        break;

      case "JOIN_ARROWS":
        validQuestion = _validateJoinArrows(question, index);
        break;
    }

    auxQuestions.push(validQuestion);
  });
  return auxQuestions;
}

var correctQuestions = function correctQuestions(questions, answers) {
  var correction = questions.map(function (question) {
    var answer = answers.find(function (a) {
      return a.id === question.id;
    });

    switch (question.type) {
      case "MONO_TEST":
        return _correctMonoTest(question, answer.data.optionsMonoTest.find(function (a) {
          return a.correct;
        }));

      case "MULTI_TEST":
        return _correctMultiTest(question, answer.data.optionsMultiTest.filter(function (a) {
          return a.correct;
        }));

      case "FILL_TEXT":
        return _correctFillText(question, answer.data.tokensFill);

      case "DROPDOWN_SELECT":
        return _correctDropdownSelect(question, answer.data.dropdownSelectQuestions);

      case "FILL_DROPDOWN":
        return _correctFillDropdown(question, answer.data.tokensFill);

      case "DRAG_CATEGORIES":
        return _correctDragCategories(question, answer.data.dragCategories);

      case "DRAG_CATEGORIES_IMG":
        return _correctDragCategoriesImg(question, answer.data.dragCategories);

      case "JOIN_DRAG":
        return _correctJoinDrag(question, answer.data.joinDrag);

      case "JOIN_DRAG_IMG":
        return _correctJoinDragImg(question, answer.data.joinDrag);
    }
  });
  return correction;
};

exports.correctQuestions = correctQuestions;

var shuffleQuestionnaire = function shuffleQuestionnaire(questions) {
  return _shuffle(questions.map(function (question) {
    switch (question.type) {
      case "MONO_TEST":
      case "MULTI_TEST":
        return _objectSpread(_objectSpread({}, question), {}, {
          options: _shuffle(question.options)
        });

      case "FILL_TEXT":
        return question;

      case "DROPDOWN_SELECT":
        return _objectSpread(_objectSpread({}, question), {}, {
          questions: _shuffle(question.questions.map(function (qo) {
            return _objectSpread(_objectSpread({}, qo), {}, {
              options: _shuffle(qo.options)
            });
          }))
        });

      case "FILL_DROPDOWN":
        return _objectSpread(_objectSpread({}, question), {}, {
          tokens: question.tokens.map(function (t) {
            return _objectSpread(_objectSpread({}, t), {}, {
              options: t.type === "input" ? _shuffle(t.options) : t.options
            });
          })
        });

      case "DRAG_CATEGORIES":
      case "DRAG_CATEGORIES_IMG":
      case "JOIN_DRAG":
      case "JOIN_DRAG_IMG":
        return _objectSpread(_objectSpread({}, question), {}, {
          options: _shuffle(question.options),
          targetCategories: _shuffle(question.targetCategories)
        });
    }
  }));
};

exports.shuffleQuestionnaire = shuffleQuestionnaire;

var _shuffleMonoTest = function _shuffleMonoTest(question) {
  return _objectSpread(_objectSpread({}, question), {}, {
    options: _shuffle(question.options)
  });
};

exports._shuffleMonoTest = _shuffleMonoTest;

var _shuffle = function _shuffle(array) {
  var currentIndex = array.length,
      randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    var _ref = [array[randomIndex], array[currentIndex]];
    array[currentIndex] = _ref[0];
    array[randomIndex] = _ref[1];
  }

  return array;
};

var _correctMonoTest = function _correctMonoTest(question, answer) {
  return {
    id: question.id,
    grade: question.option_id_selected === answer.option_id ? 100 : 0,
    type: question.type,
    title: question.title,
    have_clue: question.have_clue,
    clue: question.clue,
    image: question.image,
    image_url: question.image_url,
    options: _mapOptionsForCorrectMonoTest(question, answer)
  };
};

var _mapOptionsForCorrectMonoTest = function _mapOptionsForCorrectMonoTest(question, answer) {
  var sortedOptions = _lodash["default"].orderBy(question.options, ['id'], ['asc']);

  return sortedOptions.map(function (opt) {
    return {
      id: opt.id,
      text: opt.text,
      correct: opt.id === answer.option_id,
      errored: question.option_id_selected !== answer.option_id && question.option_id_selected === opt.id
    };
  });
};

var _correctMultiTest = function _correctMultiTest(question, answer) {
  var ANSWER_VALUE = 100 / answer.length;
  var grade = 0;

  if (question.options_id_selected.length > 0) {
    grade = question.options_id_selected.map(function (a) {
      return answer.find(function (b) {
        return b.option_id === a;
      }) ? ANSWER_VALUE : -ANSWER_VALUE;
    }).reduce(function (prev, current) {
      return prev + current;
    });

    if (grade < 0) {
      grade = 0;
    }
  }

  return {
    id: question.id,
    type: question.type,
    title: question.title,
    have_clue: question.have_clue,
    clue: question.clue,
    image: question.image,
    image_url: question.image_url,
    grade: _sanitazeGrade(grade),
    options: _mapOptionsForCorrectMultiTest(question, answer)
  };
};

var _mapOptionsForCorrectMultiTest = function _mapOptionsForCorrectMultiTest(question, answer) {
  var sortedOptions = _lodash["default"].orderBy(question.options, ['id'], ['asc']);

  return sortedOptions.map(function (opt) {
    return {
      id: opt.id,
      text: opt.text,
      correct: !!answer.find(function (o) {
        return o.option_id === opt.id;
      }),
      errored: !!answer.find(function (o) {
        return o.option_id === opt.id;
      }) && question.options_id_selected.includes(opt.id)
    };
  });
};

var _correctFillText = function _correctFillText(question, answer) {
  var INPUT_LENGTH = answer.filter(function (a) {
    return a.input;
  }).length;
  var ANSWER_VALUE = 100 / INPUT_LENGTH;
  var correctedTokens = [];
  var grade = question.tokens.map(function (token, index) {
    var aux = {
      id: token.id,
      type: token.type
    };

    if (token.type === 'input') {
      aux.errored = !_compareFill(token.value, answer[index].text);
      aux.good = answer[index].text;
      aux.wrong = aux.errored ? token.value : undefined;
    } else {
      aux.text = token.text;
    }

    correctedTokens.push(aux);
    return token.type === "input" ? _compareFill(token.value, answer[index].text) ? ANSWER_VALUE : 0 : 0;
  }).reduce(function (prev, current) {
    return prev + current;
  });
  return {
    id: question.id,
    type: question.type,
    title: question.title,
    have_clue: question.have_clue,
    clue: question.clue,
    image: question.image,
    image_url: question.image_url,
    grade: _sanitazeGrade(grade),
    tokens: correctedTokens
  };
};

var _correctDropdownSelect = function _correctDropdownSelect(question, answer) {
  var ANSWER_VALUE = 100 / question.questions.length;
  var grade = 0;
  var correctedQuestions = [];
  grade = question.questions.map(function (a) {
    var _answer$a$id, _answer$a$id$options$, _answer$a$id2;

    var errored = !((_answer$a$id = answer[a.id]) !== null && _answer$a$id !== void 0 && (_answer$a$id$options$ = _answer$a$id.options[a.option_id_selected]) !== null && _answer$a$id$options$ !== void 0 && _answer$a$id$options$.correct);
    correctedQuestions.push({
      id: a.id,
      text: a.text,
      option: {
        errored: errored,
        good: ((_answer$a$id2 = answer[a.id]) === null || _answer$a$id2 === void 0 ? void 0 : _answer$a$id2.options.find(function (op) {
          return op.correct;
        })).text,
        wrong: errored && a.option_id_selected != undefined ? a.options.find(function (op) {
          return op.id === a.option_id_selected;
        }).value : undefined
      }
    });
    return !errored ? ANSWER_VALUE : 0;
  }).reduce(function (prev, current) {
    return prev + current;
  });
  return {
    id: question.id,
    grade: _sanitazeGrade(grade),
    type: question.type,
    title: question.title,
    have_clue: question.have_clue,
    clue: question.clue,
    image: question.image,
    image_url: question.image_url,
    questions: correctedQuestions
  };
};

var _correctFillDropdown = function _correctFillDropdown(question, answer) {
  var INPUT_LENGTH = answer.filter(function (a) {
    return a.input;
  }).length;
  var ANSWER_VALUE = 100 / INPUT_LENGTH;
  var correctedTokens = [];
  var grade = question.tokens.map(function (token, index) {
    var _answer$index3, _answer$index3$option;

    var aux = {
      id: token.id,
      type: token.type
    };

    if (token.type === 'input') {
      var _answer$index, _answer$index$options, _answer$index2, _answer$index2$option, _token$options$find;

      aux.errored = !((_answer$index = answer[index]) !== null && _answer$index !== void 0 && (_answer$index$options = _answer$index.options[token.option_id_selected]) !== null && _answer$index$options !== void 0 && _answer$index$options.correct);
      aux.good = ((_answer$index2 = answer[index]) === null || _answer$index2 === void 0 ? void 0 : (_answer$index2$option = _answer$index2.options) === null || _answer$index2$option === void 0 ? void 0 : _answer$index2$option.find(function (t) {
        return t.correct;
      })).text;
      aux.wrong = aux.errored ? (_token$options$find = token.options.find(function (t) {
        return t.id === token.option_id_selected;
      })) === null || _token$options$find === void 0 ? void 0 : _token$options$find.value : undefined;
    } else {
      aux.text = token.text;
    }

    correctedTokens.push(aux);
    return token.type === "input" ? (_answer$index3 = answer[index]) !== null && _answer$index3 !== void 0 && (_answer$index3$option = _answer$index3.options[token.option_id_selected]) !== null && _answer$index3$option !== void 0 && _answer$index3$option.correct ? ANSWER_VALUE : 0 : 0;
  }).reduce(function (prev, current) {
    return prev + current;
  });
  return {
    id: question.id,
    grade: grade,
    type: question.type,
    title: question.title,
    have_clue: question.have_clue,
    clue: question.clue,
    image: question.image,
    image_url: question.image_url,
    inputs_number: question.tokens.length,
    tokens: correctedTokens
  };
};

var _correctDragCategories = function _correctDragCategories(question, answer) {
  var TOTAL_OPTIONS = answer.map(function (a) {
    return a.options.length;
  }).reduce(function (prev, current) {
    return prev + current;
  });
  var ANSWER_VALUE = 100 / TOTAL_OPTIONS;
  var targetCategories = answer.map(function (an) {
    return {
      id: an.id,
      name: an.title,
      values: an.options.map(function (o) {
        return {
          id: o.option_id,
          text: o.text
        };
      })
    };
  });
  var grade = question.targetCategories.map(function (category) {
    var correctOptions = answer.find(function (a) {
      return a.id === category.id;
    }).options;

    if (category.values.length > 0) {
      return category.values.map(function (c) {
        return correctOptions.find(function (co) {
          return co.text === c.text;
        }) ? ANSWER_VALUE : 0;
      }).reduce(function (prev, current) {
        return prev + current;
      });
    }

    return 0;
  }).reduce(function (prev, current) {
    return prev + current;
  });
  return {
    id: question.id,
    grade: _sanitazeGrade(grade),
    type: question.type,
    title: question.title,
    have_clue: question.have_clue,
    clue: question.clue,
    targetCategories: targetCategories
  };
};

var _correctDragCategoriesImg = function _correctDragCategoriesImg(question, answer) {
  var TOTAL_OPTIONS = answer.map(function (a) {
    return a.options.length;
  }).reduce(function (prev, current) {
    return prev + current;
  });
  var ANSWER_VALUE = 100 / TOTAL_OPTIONS;
  var targetCategories = answer.map(function (an) {
    return {
      id: an.id,
      name: an.title,
      values: an.options.map(function (op) {
        return {
          id: an.id,
          image_url: op.text
        };
      })
    };
  });
  var grade = question.targetCategories.map(function (category) {
    var _answer$find;

    var correctOptions = (_answer$find = answer.find(function (a) {
      return a.id === category.id;
    })) === null || _answer$find === void 0 ? void 0 : _answer$find.options;

    if (category.values.length > 0) {
      return category.values.map(function (c) {
        return correctOptions.find(function (co) {
          return co.text === c.image_url;
        }) ? ANSWER_VALUE : 0;
      }).reduce(function (prev, current) {
        return prev + current;
      });
    }

    return 0;
  }).reduce(function (prev, current) {
    return prev + current;
  });
  return {
    id: question.id,
    grade: _sanitazeGrade(grade),
    type: question.type,
    title: question.title,
    have_clue: question.have_clue,
    clue: question.clue,
    targetCategories: targetCategories
  };
};

var _correctJoinDrag = function _correctJoinDrag(question, answer) {
  var TOTAL_OPTIONS = answer.length;
  var ANSWER_VALUE = 100 / TOTAL_OPTIONS;
  var targetCategories = [];
  var grade = question.targetCategories.map(function (category) {
    var correctOption = answer.find(function (a) {
      return a.id === category.id;
    });
    targetCategories.push({
      id: category.id,
      name: category.name,
      values: [{
        id: correctOption.id,
        text: correctOption.from
      }]
    });

    if (category.values.length > 0) {
      return correctOption.from === category.values[0].text ? ANSWER_VALUE : 0;
    }

    return 0;
  }).reduce(function (prev, current) {
    return prev + current;
  });
  return {
    id: question.id,
    grade: _sanitazeGrade(grade),
    type: question.type,
    title: question.title,
    have_clue: question.have_clue,
    clue: question.clue,
    targetCategories: targetCategories
  };
};

var _correctJoinDragImg = function _correctJoinDragImg(question, answer) {
  var TOTAL_OPTIONS = answer.length;
  var ANSWER_VALUE = 100 / TOTAL_OPTIONS;
  var targetCategories = [];
  var grade = question.targetCategories.map(function (category) {
    var correctOption = answer.find(function (a) {
      return a.id === category.id;
    });
    targetCategories.push({
      id: category.id,
      name: category.name,
      values: [{
        id: correctOption.id,
        image_url: correctOption.from
      }]
    });

    if (category.values.length > 0) {
      return category.name === correctOption.to ? ANSWER_VALUE : 0;
    }

    return 0;
  }).reduce(function (prev, current) {
    return prev + current;
  });
  return {
    id: question.id,
    grade: _sanitazeGrade(grade),
    type: question.type,
    title: question.title,
    have_clue: question.have_clue,
    clue: question.clue,
    targetCategories: targetCategories
  };
};

var _validateMonoTest = function _validateMonoTest(question, index) {
  var aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    image: question.image,
    image_url: question.imageUrl,
    answered: false,
    options: _getMonoTestOptions(question.data.optionsMonoTest),
    option_id_selected: null
  };
  return aux;
};

var _validateMultiTest = function _validateMultiTest(question, index) {
  var _question$data;

  var aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    image: question.image,
    image_url: question.imageUrl,
    answered: false,
    options: _getMonoTestOptions(question === null || question === void 0 ? void 0 : (_question$data = question.data) === null || _question$data === void 0 ? void 0 : _question$data.optionsMultiTest),
    options_id_selected: []
  };
  return aux;
};

var _validateFillText = function _validateFillText(question, index) {
  var _question$data2;

  var aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    image: question.image,
    image_url: question.imageUrl,
    answered: false,
    tokens: _getFillTextTokens(question === null || question === void 0 ? void 0 : (_question$data2 = question.data) === null || _question$data2 === void 0 ? void 0 : _question$data2.tokensFill),
    inputs_number: question.data.tokensFill.length
  };
  return aux;
};

var _validateDropdownSelect = function _validateDropdownSelect(question, index) {
  var _question$data3;

  var aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    image: question.image,
    image_url: question.imageUrl,
    answered: false,
    questions: _getDropdownSelectQuestions(question === null || question === void 0 ? void 0 : (_question$data3 = question.data) === null || _question$data3 === void 0 ? void 0 : _question$data3.dropdownSelectQuestions)
  };
  return aux;
};

var _validateFillDropdown = function _validateFillDropdown(question, index) {
  var _question$data4;

  var aux = _defineProperty({
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    image: question.image,
    image_url: question.imageUrl,
    answered: false,
    inputs_number: question.data.tokensFill.length,
    tokens: _getFillDropdownTokens(question === null || question === void 0 ? void 0 : (_question$data4 = question.data) === null || _question$data4 === void 0 ? void 0 : _question$data4.tokensFill)
  }, "inputs_number", question.data.tokensFill.length);

  return aux;
};

var _validateDragCategories = function _validateDragCategories(question, index) {
  var _question$data5, _question$data6;

  var aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    answered: false,
    options: _getDragOptions(question === null || question === void 0 ? void 0 : (_question$data5 = question.data) === null || _question$data5 === void 0 ? void 0 : _question$data5.dragCategories),
    targetCategories: _getDragCategories(question === null || question === void 0 ? void 0 : (_question$data6 = question.data) === null || _question$data6 === void 0 ? void 0 : _question$data6.dragCategories)
  };
  return aux;
};

var _validateDragCategoriesImg = function _validateDragCategoriesImg(question, index) {
  var _question$data7, _question$data8;

  var aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    answered: false,
    options: _getDragImgOptions(question === null || question === void 0 ? void 0 : (_question$data7 = question.data) === null || _question$data7 === void 0 ? void 0 : _question$data7.dragCategories),
    targetCategories: _getDragCategories(question === null || question === void 0 ? void 0 : (_question$data8 = question.data) === null || _question$data8 === void 0 ? void 0 : _question$data8.dragCategories)
  };
  return aux;
};

var _validateJoinDrag = function _validateJoinDrag(question, index) {
  var _question$data9, _question$data10;

  var aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    answered: false,
    options: _getDragFrom(question === null || question === void 0 ? void 0 : (_question$data9 = question.data) === null || _question$data9 === void 0 ? void 0 : _question$data9.joinDrag),
    targetCategories: _getDragTo(question === null || question === void 0 ? void 0 : (_question$data10 = question.data) === null || _question$data10 === void 0 ? void 0 : _question$data10.joinDrag)
  };
  return aux;
};

var _validateJoinDragImg = function _validateJoinDragImg(question, index) {
  var _question$data11, _question$data12;

  var aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    answered: false,
    options: _getDragImgFrom(question === null || question === void 0 ? void 0 : (_question$data11 = question.data) === null || _question$data11 === void 0 ? void 0 : _question$data11.joinDrag),
    targetCategories: _getDragTo(question === null || question === void 0 ? void 0 : (_question$data12 = question.data) === null || _question$data12 === void 0 ? void 0 : _question$data12.joinDrag)
  };
  return aux;
};

var _getMonoTestOptions = function _getMonoTestOptions(options) {
  var auxOptions = [];
  options.forEach(function (option) {
    auxOptions.push({
      id: option.option_id,
      text: option.text
    });
  });
  return auxOptions;
};

var _getFillTextTokens = function _getFillTextTokens(tokens) {
  var auxTokens = [];
  tokens.forEach(function (token, index) {
    if (token.input) {
      auxTokens.push({
        id: index,
        type: "input",
        value: ""
      });
    } else {
      auxTokens.push({
        id: index,
        type: "text",
        text: token.text
      });
    }
  });
  return auxTokens;
};

var _getFillDropdownTokens = function _getFillDropdownTokens(tokens) {
  var auxTokens = [];
  tokens.forEach(function (token, index) {
    if (token.input) {
      var auxOptions = [];
      token.options.forEach(function (option, i) {
        auxOptions.push({
          id: i,
          value: option.text
        });
      });
      auxTokens.push({
        id: index,
        type: "input",
        options: auxOptions
      });
    } else {
      auxTokens.push({
        id: index,
        type: "text",
        text: token.text
      });
    }
  });
  return auxTokens;
};

var _getDropdownSelectQuestions = function _getDropdownSelectQuestions(questions) {
  var auxQuestions = [];
  questions.forEach(function (question, index) {
    var auxOptions = [];
    question.options.forEach(function (option, index) {
      auxOptions.push({
        id: index,
        value: option.text
      });
    });
    auxQuestions.push({
      id: index,
      text: question.title,
      option_id_selected: null,
      options: auxOptions
    });
  });
  return auxQuestions;
};

var _getDragCategories = function _getDragCategories(categories) {
  var targetCategories = [];
  categories.forEach(function (category, index) {
    targetCategories.push({
      id: index,
      name: category.title,
      values: []
    });
  });
  return targetCategories;
};

var _getDragOptions = function _getDragOptions(categories) {
  var options = [];
  categories.forEach(function (category) {
    category.options.forEach(function (option) {
      options.push({
        id: options.length,
        text: option.text
      });
    });
  });
  return options;
};

var _getDragImgOptions = function _getDragImgOptions(categories) {
  var options = [];
  categories.forEach(function (category) {
    category.options.forEach(function (option) {
      options.push({
        id: options.length,
        image_url: option.text
      });
    });
  });
  return options;
};

var _getDragTo = function _getDragTo(relations) {
  var targetCategories = [];
  relations.forEach(function (relation, index) {
    targetCategories.push({
      id: index,
      name: relation.to,
      values: []
    });
  });
  return targetCategories;
};

var _getDragFrom = function _getDragFrom(relations) {
  var options = [];
  relations.forEach(function (relation, index) {
    options.push({
      id: index,
      text: relation.from
    });
  });
  return options;
};

var _getDragImgFrom = function _getDragImgFrom(relations) {
  var options = [];
  relations.forEach(function (relation, index) {
    options.push({
      id: index,
      image_url: relation.from
    });
  });
  return options;
};

var _compareFill = function _compareFill(inputText, correctText) {
  var aux1 = removeAccents(inputText.toLowerCase());
  var aux2 = removeAccents(correctText.toLowerCase());
  return aux1 === aux2;
};

var removeAccents = function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

var _sanitazeGrade = function _sanitazeGrade(grade) {
  if (grade > 100 || grade > 99 && grade < 100) {
    return 100;
  } else {
    return _round(grade);
  }
};

var _round = function _round(num) {
  var m = Number((Math.abs(num) * 100).toPrecision(15));
  return Math.round(m) / 100 * Math.sign(num);
};