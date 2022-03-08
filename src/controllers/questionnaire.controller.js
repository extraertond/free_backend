import env from "node-env-file";
import Class from "../models/Class";
import User from "../models/User";
import Year from "../models/Year";
import {
  serverError,
  privilegesError,
  badRequestError,
  duplicateClassError,
  questionnaireCreatedOk,
  getQuestionnaireForTeachersOk,
  questionnaireUpdatedOk,
  questionnaireDeletedOk,
  getQuestionnairesForTeachersOk,
  getQuestionnairesForStudentsOk,
  getQuestionnaireForStudentsOk,
  answerCreateOk,
  getRevisionForStudentsOk,
  getGradesOk,
} from "../util/responses";
import { sequelize } from "../database/database";
import { getStudentData, getUserByToken, correctQuestions, shuffleQuestionnaire } from "../util/helpers";
import Questionnaire from "../models/Questionnaire";
import Questionnaire_Class from "../models/Questionnaire_Class";
import User_Class from "../models/User_Class";
import Subject from "../models/Subject";
import Answer from "../models/Answer";
import { Op } from "sequelize";
env(__dirname + "/../../.env");

export async function createQuestionnaire(req, res) {
  try {
    const { classes, info, questions } = req.body;
    const user = await getUserByToken(req.headers.token);

    if (!classes || !info || !questions || !user) {
      return badRequestError(res);
    }

    await sequelize.transaction(async (t) => {
      const questionnaire = await Questionnaire.create(
        {
          userId: user.id,
          subjectId: parseInt(info.subject),
          title: info.title,
          visible: false,
          raw_data: JSON.stringify(questions),
          student_data: JSON.stringify(getStudentData(questions)),
        },
        { transaction: t }
      );

      for (const auxClass of classes) {
        await Questionnaire_Class.create(
          {
            questionnaireId: questionnaire.id,
            classId: auxClass.classId,
          },
          { transaction: t }
        );
      }
    });
    questionnaireCreatedOk(res);
  } catch (e) {
    e.original && e.original.code == "ER_DUP_ENTRY" ? duplicateClassError(res) : serverError(res, e);
  }
}

export async function updateQuestionnaire(req, res) {
  try {
    const { classes, info, questions } = req.body;
    const user = await getUserByToken(req.headers.token);

    if (!classes || !info || !info.id || !questions || !user) {
      return badRequestError(res);
    }
    await sequelize.transaction(async (t) => {
      await Questionnaire.update(
        {
          subjectId: parseInt(info.subject),
          title: info.title,
          raw_data: JSON.stringify(questions),
          student_data: JSON.stringify(getStudentData(questions)),
        },
        { where: { id: info.id }, transaction: t }
      );

      await Questionnaire_Class.destroy({ where: { questionnaireId: info.id }, transaction: t });
      await Answer.destroy({ where: { questionnaireId: info.id }, transaction: t });
      for (const auxClass of classes) {
        await Questionnaire_Class.create(
          {
            questionnaireId: info.id,
            classId: auxClass.classId,
          },
          { transaction: t }
        );
      }
    });
    questionnaireCreatedOk(res);
  } catch (e) {
    e.original && e.original.code == "ER_DUP_ENTRY" ? duplicateClassError(res) : serverError(res, e);
  }
}

export async function getQuestionnairesForTeachers(req, res) {
  try {
    if (!req.headers.token) {
      return privilegesError(res);
    }
    let questionnaires = await Questionnaire.findAll({
      attributes: ["id", "title", "visible", "reviewable", "can_remake", "view_grade", "created_at"],
      include: [
        Subject,
        {
          model: Questionnaire_Class,
          include: [
            {
              model: Class,
              include: [Year],
            },
          ],
        },
        {
          model: User,
          attributes: ["id"],
        },
      ],
    });
    const user = await getUserByToken(req.headers.token);
    let auxQuestionnaires = [];
    questionnaires.forEach((questionnaire) => {
      if (questionnaire.user.id == user.id) {
        let auxQuestionnaire = { ...questionnaire.dataValues };
        auxQuestionnaire.owner = true;
        auxQuestionnaires.push(auxQuestionnaire);
      } else {
        let auxQuestionnaire = { ...questionnaire.dataValues };
        auxQuestionnaire.owner = false;
        auxQuestionnaires.push(auxQuestionnaire);
      }
    });
    if (auxQuestionnaires) { getQuestionnairesForTeachersOk(res, auxQuestionnaires); }
  } catch (e) {
    serverError(res, e);
  }
}

export async function getQuestionnairesForStudents(req, res) {
  try {
    if (!req.headers.token) { return privilegesError(res); }

    const user = await getUserByToken(req.headers.token);
    if (!user) { return privilegesError(res); }

    const classIds = await User_Class.findAll({ where: { type: "AL", userId: user.id }, attributes: ["classId"] });
    let auxClassIds = [];
    classIds.forEach((cid) => {
      auxClassIds.push(cid.classId);
    });
    const questionnaireClasses = await Questionnaire_Class.findAll({ where: { classId: { [Op.in]: auxClassIds } } });
    let questionnaireIds = [];
    questionnaireClasses.forEach((qid) => {
      questionnaireIds.push(qid.questionnaireId);
    });
    let questionnaires = await Questionnaire.findAll({
      attributes: ["id", "title", "reviewable", "can_remake", "view_grade"],
      include: [Subject],
      where: { visible: true, id: { [Op.in]: questionnaireIds } },
    });
    let auxQuestionnaires = [];
    for (let e of questionnaires) {
 
      const grades = await Answer.findAll({
        order: [['created_at', 'DESC']],
        attributes: ["id", "grade", "total_questions", "questions_answered", "created_at"],
        where: { questionnaireId: e.id, userId: user.id }
      });
      auxQuestionnaires.push({...e.dataValues, grades});
    }

    if (questionnaires) { return getQuestionnairesForStudentsOk(res, auxQuestionnaires); }
  } catch (e) {
    return serverError(res, e);
  }
}

export async function changeVisibility(req, res) {
  const { value, id } = req.body;
  try {
    if (value == undefined || !id) { return badRequestError(res); }

    const questionnaire = await Questionnaire.findOne({ where: { id: id } });
    if (questionnaire) {
      await questionnaire.update({
        visible: value,
      });
      questionnaireUpdatedOk(res);
    } else {
      incorrectCredentialsError(res);
    }
  } catch (e) {
    serverError(res, e);
  }
}

export async function changeReviewable(req, res) {
  const { value, id } = req.body;
  try {
    if (value == undefined || !id) return badRequestError(res);

    const questionnaire = await Questionnaire.findOne({ where: { id: id } });
    if (questionnaire) {
      await questionnaire.update({
        reviewable: value,
      });
      questionnaireUpdatedOk(res);
    } else {
      incorrectCredentialsError(res);
    }
  } catch (e) {
    serverError(res, e);
  }
}

export async function changeRemake(req, res) {
  const { value, id } = req.body;
  try {
    if (value == undefined || !id) return badRequestError(res);

    const questionnaire = await Questionnaire.findOne({ where: { id: id } });
    if (questionnaire) {
      await questionnaire.update({
        can_remake: value,
      });
      questionnaireUpdatedOk(res);
    } else {
      incorrectCredentialsError(res);
    }
  } catch (e) {
    serverError(res, e);
  }
}

export async function changeViewgrade(req, res) {
  const { value, id } = req.body;
  try {
    if (value == undefined || !id) return badRequestError(res);

    const questionnaire = await Questionnaire.findOne({ where: { id: id } });
    if (questionnaire) {
      await questionnaire.update({
        view_grade: value,
      });
      questionnaireUpdatedOk(res);
    } else {
      incorrectCredentialsError(res);
    }
  } catch (e) {
    serverError(res, e);
  }
}

export async function deleteQuestionnaire(req, res) {
  const { id } = req.params;
  try {
    if (!id) return badRequestError(res);
    await sequelize.transaction(async (t) => {
      await Questionnaire.destroy({ where: { id } }, { transaction: t });
      await Questionnaire_Class.destroy({ where: { questionnaireId: id } }, { transaction: t });
      await Answer.destroy({ where: { questionnaireId: id } }, { transaction: t });
      questionnaireDeletedOk(res);
    });
    
  } catch (e) {
    serverError(res, e);
  }
}

export async function getQuestionnaireForTeacher(req, res) {
  const { id } = req.params;
  try {
    if (!id) return badRequestError(res);
    
    const questionnaire = await Questionnaire.findOne({
      where: { id },
      attributes: ["id", "userId", "raw_data", "title"],
      include: [Subject, Questionnaire_Class],
    });
    questionnaire.raw_data = JSON.parse(questionnaire.raw_data);
    if (questionnaire) getQuestionnaireForTeachersOk(res, questionnaire);
  } catch (e) {
    serverError(res, e);
  }
}

export async function getGradesByQuestionnaire(req, res) {
  const { id } = req.params;
  try {
    if (!id) return badRequestError(res);
    const answers = await Answer.findAll({
      where: { questionnaireId: id },
      attributes: ["grade", "questions_answered", "created_at"],
      include: [{model: User, attributes: ['name', 'lastname1', 'lastname2']}],
    });
    if (answers) getGradesOk(res, answers);
  } catch (e) {
    serverError(res, e);
  }
}

export async function getQuestionnaireForStudent(req, res) {
  const { id } = req.params;
  try {
    if (!req.headers.token) {
      return privilegesError(res);
    }

    const user = await getUserByToken(req.headers.token);
    if (!user) {
      return privilegesError(res);
    }


    let questionnaire = await Questionnaire.findOne({
      attributes: ["id", "title", "student_data"],
      include: [Subject],
      where: { id, visible: true },
    });

    let authorize = false;
    if (user.role.name === 'teacher') {
      authorize = true;
    } else {
      const userClasses = await User_Class.findAll({where: {userId: user.id, type: 'AL'}});
      const questionnaireClasses = await Questionnaire_Class.findAll({where: {questionnaireId: questionnaire.id}});
      if (userClasses && questionnaireClasses) {
        userClasses.forEach(uClass => {
          const aux = questionnaireClasses.find(qclass => uClass.classId === qclass.classId);
          if (aux) { authorize = true; }
        });
      } else {
        return serverError(res);
      }
    }
    
    if (authorize && questionnaire) {
      questionnaire.student_data = shuffleQuestionnaire(JSON.parse(questionnaire.student_data));
      return getQuestionnaireForStudentsOk(res, questionnaire);
    } else {
      return serverError(res);
    }
  } catch (e) {
    return serverError(res, e);
  }
}

export async function getRevisionForStudent(req, res) {
  const { id } = req.params;
  try {
    if (!req.headers.token) {
      return privilegesError(res);
    }

    const user = await getUserByToken(req.headers.token);
    if (!user) {
      return privilegesError(res);
    }
    
    const answer = await Answer.findOne({ attributes: ["userId", "revision"], where: { id } });

    if (answer.userId === user.id) {
      return getRevisionForStudentsOk(res, answer.revision);
    } else {
      return privilegesError(res);
    }
  } catch (e) {
    return serverError(res, e);
  }
}

export async function correctQuestionnaire(req, res) {
  try {
    if (!req.headers.token) {
      return privilegesError(res);
    }

    const user = await getUserByToken(req.headers.token);
    if (!user) {
      return privilegesError(res);
    }

    const { questions, id } = req.body.questionnaire;
    if (!questions || !id) {
      return serverError(res);
    }

    const questionnaireAnswers = await Questionnaire.findOne({ attributes: ["id", "raw_data", "title"], where: { id } });
    const correct = correctQuestions(questions, JSON.parse(questionnaireAnswers.raw_data));
    const correction = {
      id: questionnaireAnswers.id, 
      description_test: `Revisión de "${questionnaireAnswers.title}"`,
      questions_number: correct.length,
      question_id: -1, 
      questions: correct
    };
    let grade = correct.map(c => c.grade).reduce((c1, c2) => c1+c2)/(10*questions.length);
    if (grade > 10) {grade = 10};
    await sequelize.transaction(async (t) => {

      const answer = await Answer.create(
        {
          userId: user.id,
          questionnaireId: id,
          visible: true,
          grade: _round(grade),
          total_questions: questions.length,
          questions_answered: (questions.filter(q => q.answered)).length,
          revision: JSON.stringify(correction)
        },
        { transaction: t }
      );
      if (answer) return answerCreateOk(res);
    });
  } catch (e) {
    return serverError(res, e);
  }
}

export async function getGradesByUser(req, res) {
  const { id } = req.params;
  try {
    if (!id) return badRequestError(res);
      const answers = await Answer.findAll({
        where: { userId: id },
        attributes: ["grade", "questions_answered", "created_at"],
        include: [{model: User, attributes: ['name', 'lastname1', 'lastname2']}],
      });
      if (answers) getGradesOk(res, answers);
  } catch (e) {
    serverError(res, e);
  }
}


const _round = (num) => {
  let m = Number((Math.abs(num) * 100).toPrecision(15));
  return Math.round(m) / 100 * Math.sign(num);
}
