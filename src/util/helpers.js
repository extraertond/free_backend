
import bcryptjs from "bcryptjs";
import env from "node-env-file";
import Role from "../models/Role";
import User from "../models/User";
import _ from 'lodash';
env(__dirname + "/../../.env");

export async function encryptPassword(password) {
  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(password, salt);
  return hash;
}

export async function matchPassword(password, savePassword) {
  try {
    return await bcryptjs.compare(password, savePassword);
  } catch (e) {
    console.log(e);
  }
}

export function validateApiKey(api_key) {
  return api_key == process.env.API_KEY;
}

export async function checkRolePrivilege(token, targetRole) {
  let actualRole = await getRoleByToken(token);
  if (actualRole == null) {
    return false;
  } else if (targetRole == "teacher") {
    return actualRole.name == "admin";
  } else if (targetRole == "student") {
    return actualRole.name == "admin" || actualRole.name == "teacher";
  }
}

export async function getRoleByToken(token) {
  let o = await User.findOne({ where: { token }, include: [Role] });
  if (o) return o.role;
  else return null;
}

export async function getUserByToken(token) {
  let o = await User.findOne({ where: { token }, include: [Role] });
  if (o) return o;
  else return null;
}

export function getStudentData(questions) {
  let auxQuestions = [];
  questions.forEach((question, index) => {
    let validQuestion;
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

export const correctQuestions = (questions, answers) => {
  const correction = questions.map((question) => {
    const answer = answers.find((a) => a.id === question.id);
    switch (question.type) {
      case "MONO_TEST":
        return _correctMonoTest(question, answer.data.optionsMonoTest.find((a) => a.correct));
      case "MULTI_TEST":
        return _correctMultiTest(question, answer.data.optionsMultiTest.filter((a) => a.correct));
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

export const shuffleQuestionnaire = (questions) => {
  return _shuffle(
    questions.map((question) => {
      switch (question.type) {
        case "MONO_TEST":
        case "MULTI_TEST":
          return { ...question, options: _shuffle(question.options) };
        case "FILL_TEXT":
          return question;
        case "DROPDOWN_SELECT":
          return {
            ...question,
            questions: _shuffle(question.questions.map((qo) => ({ ...qo, options: _shuffle(qo.options) }))),
          };
        case "FILL_DROPDOWN":
          return {
            ...question,
            tokens: question.tokens.map((t) => {
              return { ...t, options: t.type === "input" ? _shuffle(t.options) : t.options };
            }),
          };
        case "DRAG_CATEGORIES":
        case "DRAG_CATEGORIES_IMG":
        case "JOIN_DRAG":
        case "JOIN_DRAG_IMG":
          return {
            ...question,
            options: _shuffle(question.options),
            targetCategories: _shuffle(question.targetCategories),
          };
      }
    })
  );
};
export const _shuffleMonoTest = (question) => {
  return { ...question, options: _shuffle(question.options) };
};

const _shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

const _correctMonoTest = (question, answer) => {
  return {
    id: question.id,
    grade: question.option_id_selected === answer.option_id ? 100 : 0,
    type: question.type,
    title: question.title,
    have_clue: question.have_clue,
    clue: question.clue,
    image: question.image,
    image_url: question.image_url,
    options: _mapOptionsForCorrectMonoTest(question, answer),
  };
};

const _mapOptionsForCorrectMonoTest = (question, answer) => {
  const sortedOptions = _.orderBy(question.options, ['id'], ['asc']);
  return sortedOptions.map(opt => {
    return {
      id: opt.id,
      text: opt.text, 
      correct: opt.id === answer.option_id,
      errored: question.option_id_selected !== answer.option_id && question.option_id_selected === opt.id
    };
  });
};

const _correctMultiTest = (question, answer) => {
  const ANSWER_VALUE = 100 / answer.length;
  let grade = 0;
  if (question.options_id_selected.length > 0) {
    grade = question.options_id_selected
      .map((a) => {
        return answer.find((b) => b.option_id === a) ? ANSWER_VALUE : -ANSWER_VALUE;
      })
      .reduce((prev, current) => prev + current);
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

const _mapOptionsForCorrectMultiTest = (question, answer) => {
  const sortedOptions = _.orderBy(question.options, ['id'], ['asc']);
  return sortedOptions.map(opt => {
    return {
      id: opt.id,
      text: opt.text, 
      correct: !!answer.find(o => o.option_id === opt.id),
      errored: !!answer.find(o => o.option_id === opt.id) && question.options_id_selected.includes(opt.id)
    };
  });
};

const _correctFillText = (question, answer) => {
  const INPUT_LENGTH = answer.filter((a) => a.input).length;
  const ANSWER_VALUE = 100 / INPUT_LENGTH;
  const correctedTokens = [];
  const grade = question.tokens.map((token, index) => {
      let aux = { id: token.id, type: token.type };
      if (token.type === 'input') {
        aux.errored = !_compareFill(token.value, answer[index].text);
        aux.good = answer[index].text;
        aux.wrong = aux.errored ? token.value : undefined;
      } else {
        aux.text = token.text;
      }
      correctedTokens.push(aux);
      return token.type === "input" ? (_compareFill(token.value, answer[index].text) ? ANSWER_VALUE : 0) : 0;
    })
    .reduce((prev, current) => prev + current);
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

const _correctDropdownSelect = (question, answer) => {
  const ANSWER_VALUE = 100 / question.questions.length;
  let grade = 0;
  const correctedQuestions = [];
  grade = question.questions.map((a) => {
    const errored = !answer[a.id]?.options[a.option_id_selected]?.correct;
    correctedQuestions.push({
      id: a.id,
      text: a.text,
      option: {
        errored: errored ,
        good: (answer[a.id]?.options.find(op => op.correct)).text,
        wrong: (errored && a.option_id_selected != undefined) ? (a.options.find(op => op.id === a.option_id_selected)).value : undefined}
    });
    return !errored ? ANSWER_VALUE : 0;
    })
    .reduce((prev, current) => prev + current);
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

const _correctFillDropdown = (question, answer) => {
  const INPUT_LENGTH = answer.filter((a) => a.input).length;
  const ANSWER_VALUE = 100 / INPUT_LENGTH;
  const correctedTokens = [];
  const grade = question.tokens.map((token, index) => {
    let aux = { id: token.id, type: token.type };
    if (token.type === 'input') {
      aux.errored = !answer[index]?.options[token.option_id_selected]?.correct;
      aux.good = (answer[index]?.options?.find(t => t.correct)).text;
      aux.wrong = aux.errored ? (token.options.find(t => t.id === token.option_id_selected))?.value : undefined;
    } else {
      aux.text = token.text;
    }
    correctedTokens.push(aux);
    return token.type === "input" ? (answer[index]?.options[token.option_id_selected]?.correct ? ANSWER_VALUE : 0) : 0;
    })
    .reduce((prev, current) => prev + current);
  return {
    id: question.id,
    grade,
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

const _correctDragCategories = (question, answer) => {
  const TOTAL_OPTIONS = answer.map((a) => a.options.length).reduce((prev, current) => prev + current);
  const ANSWER_VALUE = 100 / TOTAL_OPTIONS;
  const targetCategories = answer.map(an => {
    return {
      id: an.id,
      name: an.title,
      values: an.options.map(o => {
        return {
          id: o.option_id,
          text: o.text
        }
      })
    }
  });

  const grade = question.targetCategories.map((category) => {
      const correctOptions = answer.find((a) => a.id === category.id).options;
      if (category.values.length > 0) {
        return category.values.map((c) => {
            return correctOptions.find((co) => co.text === c.text) ? ANSWER_VALUE : 0;
          })
        .reduce((prev, current) => prev + current);
      }
      return 0;
  }).reduce((prev, current) => prev + current);
  return {
    id: question.id,
    grade: _sanitazeGrade(grade),
    type: question.type,
    title: question.title,
    have_clue: question.have_clue,
    clue: question.clue,
    targetCategories
  };
};

const _correctDragCategoriesImg = (question, answer) => {
  const TOTAL_OPTIONS = answer.map((a) => a.options.length).reduce((prev, current) => prev + current);
  const ANSWER_VALUE = 100 / TOTAL_OPTIONS;
  const targetCategories = answer.map(an => {
    return {
      id: an.id,
      name: an.title,
      values: an.options.map( op => {
        return {
          id: an.id,
          image_url: op.text
        }
      })
    }
  });
  const grade = question.targetCategories.map((category) => {
      const correctOptions = answer.find((a) => a.id === category.id)?.options;
      if (category.values.length > 0) {
        return category.values
          .map((c) => {
            return correctOptions.find((co) => co.text === c.image_url) ? ANSWER_VALUE : 0;
          })
          .reduce((prev, current) => prev + current);
      }
      return 0;
  })
  .reduce((prev, current) => prev + current);
  return {
    id: question.id,
    grade: _sanitazeGrade(grade),
    type: question.type,
    title: question.title,
    have_clue: question.have_clue,
    clue: question.clue,
    targetCategories
  };
};

const _correctJoinDrag = (question, answer) => {
  const TOTAL_OPTIONS = answer.length;
  const ANSWER_VALUE = 100 / TOTAL_OPTIONS;
  const targetCategories = [];
  const grade = question.targetCategories.map((category) => {
    const correctOption = answer.find((a) => a.id === category.id);
    targetCategories.push({id: category.id, name: category.name, values: [{id: correctOption.id, text: correctOption.from}]});
    if (category.values.length > 0) {
      return correctOption.from === category.values[0].text ? ANSWER_VALUE : 0;
    }
    return 0;

  }).reduce((prev, current) => prev + current);
  return {
    id: question.id,
    grade: _sanitazeGrade(grade),
    type: question.type,
    title: question.title,
    have_clue: question.have_clue,
    clue: question.clue,
    targetCategories
  };
};

const _correctJoinDragImg = (question, answer) => {
  const TOTAL_OPTIONS = answer.length;
  const ANSWER_VALUE = 100 / TOTAL_OPTIONS;
  const targetCategories = [];
  const grade = question.targetCategories.map((category) => {
    const correctOption = answer.find((a) => a.id === category.id);
    targetCategories.push({id: category.id, name: category.name, values: [{id: correctOption.id, image_url: correctOption.from}]});
    if (category.values.length > 0) {
      return category.name === correctOption.to ? ANSWER_VALUE : 0;
    }
    return 0;
  }).reduce((prev, current) => prev + current);
  return {
    id: question.id,
    grade: _sanitazeGrade(grade),
    type: question.type,
    title: question.title,
    have_clue: question.have_clue,
    clue: question.clue,
    targetCategories
  };
};

const _validateMonoTest = (question, index) => {
  const aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    image: question.image,
    image_url: question.imageUrl,
    answered: false,
    options: _getMonoTestOptions(question.data.optionsMonoTest),
    option_id_selected: null,
  };
  return aux;
};

const _validateMultiTest = (question, index) => {
  const aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    image: question.image,
    image_url: question.imageUrl,
    answered: false,
    options: _getMonoTestOptions(question?.data?.optionsMultiTest),
    options_id_selected: [],
  };
  return aux;
};

const _validateFillText = (question, index) => {
  const aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    image: question.image,
    image_url: question.imageUrl,
    answered: false,
    tokens: _getFillTextTokens(question?.data?.tokensFill),
    inputs_number: question.data.tokensFill.length,
  };
  return aux;
};

const _validateDropdownSelect = (question, index) => {
  const aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    image: question.image,
    image_url: question.imageUrl,
    answered: false,
    questions: _getDropdownSelectQuestions(question?.data?.dropdownSelectQuestions),
  };
  return aux;
};

const _validateFillDropdown = (question, index) => {
  const aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    image: question.image,
    image_url: question.imageUrl,
    answered: false,
    inputs_number: question.data.tokensFill.length,
    tokens: _getFillDropdownTokens(question?.data?.tokensFill),
    inputs_number: question.data.tokensFill.length,
  };
  return aux;
};

const _validateDragCategories = (question, index) => {
  const aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    answered: false,
    options: _getDragOptions(question?.data?.dragCategories),
    targetCategories: _getDragCategories(question?.data?.dragCategories),
  };
  return aux;
};

const _validateDragCategoriesImg = (question, index) => {
  const aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    answered: false,
    options: _getDragImgOptions(question?.data?.dragCategories),
    targetCategories: _getDragCategories(question?.data?.dragCategories),
  };
  return aux;
};

const _validateJoinDrag = (question, index) => {
  const aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    answered: false,
    options: _getDragFrom(question?.data?.joinDrag),
    targetCategories: _getDragTo(question?.data?.joinDrag),
  };
  return aux;
};

const _validateJoinDragImg = (question, index) => {
  const aux = {
    id: index,
    type: question.type,
    title: question.title,
    have_clue: question.help,
    clue: question.helpText,
    answered: false,
    options: _getDragImgFrom(question?.data?.joinDrag),
    targetCategories: _getDragTo(question?.data?.joinDrag),
  };
  return aux;
};

const _getMonoTestOptions = (options) => {
  let auxOptions = [];
  options.forEach((option) => {
    auxOptions.push({ id: option.option_id, text: option.text });
  });
  return auxOptions;
};

const _getFillTextTokens = (tokens) => {
  let auxTokens = [];
  tokens.forEach((token, index) => {
    if (token.input) {
      auxTokens.push({ id: index, type: "input", value: "" });
    } else {
      auxTokens.push({ id: index, type: "text", text: token.text });
    }
  });
  return auxTokens;
};

const _getFillDropdownTokens = (tokens) => {
  let auxTokens = [];
  tokens.forEach((token, index) => {
    if (token.input) {
      let auxOptions = [];
      token.options.forEach((option, i) => {
        auxOptions.push({ id: i, value: option.text });
      });
      auxTokens.push({ id: index, type: "input", options: auxOptions });
    } else {
      auxTokens.push({ id: index, type: "text", text: token.text });
    }
  });
  return auxTokens;
};

const _getDropdownSelectQuestions = (questions) => {
  let auxQuestions = [];
  questions.forEach((question, index) => {
    let auxOptions = [];
    question.options.forEach((option, index) => {
      auxOptions.push({ id: index, value: option.text });
    });
    auxQuestions.push({ id: index, text: question.title, option_id_selected: null, options: auxOptions });
  });
  return auxQuestions;
};

const _getDragCategories = (categories) => {
  let targetCategories = [];
  categories.forEach((category, index) => {
    targetCategories.push({ id: index, name: category.title, values: [] });
  });
  return targetCategories;
};

const _getDragOptions = (categories) => {
  let options = [];
  categories.forEach((category) => {
    category.options.forEach((option) => {
      options.push({ id: options.length, text: option.text });
    });
  });

  return options;
};

const _getDragImgOptions = (categories) => {
  let options = [];
  categories.forEach((category) => {
    category.options.forEach((option) => {
      options.push({ id: options.length, image_url: option.text });
    });
  });

  return options;
};

const _getDragTo = (relations) => {
  let targetCategories = [];
  relations.forEach((relation, index) => {
    targetCategories.push({ id: index, name: relation.to, values: [] });
  });
  return targetCategories;
};

const _getDragFrom = (relations) => {
  let options = [];
  relations.forEach((relation, index) => {
    options.push({ id: index, text: relation.from });
  });
  return options;
};

const _getDragImgFrom = (relations) => {
  let options = [];
  relations.forEach((relation, index) => {
    options.push({ id: index, image_url: relation.from });
  });
  return options;
};

const _compareFill = (inputText, correctText) => {
  let aux1 = removeAccents(inputText.toLowerCase());
  let aux2 = removeAccents(correctText.toLowerCase());
  return aux1 === aux2;
};

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const _sanitazeGrade = (grade) => {
  if ((grade > 100 )|| (grade > 99 && grade < 100)) {
    return 100;
  } else {
    return _round(grade)
  }
}

const _round = (num) => {
  let m = Number((Math.abs(num) * 100).toPrecision(15));
  return Math.round(m) / 100 * Math.sign(num);
}
