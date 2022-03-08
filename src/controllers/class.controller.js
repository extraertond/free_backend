import env from "node-env-file";
import Class from "../models/Class";
import User from "../models/User";
import Year from "../models/Year";
import {
  serverError,
  privilegesError,
  badRequestError,
  classesOk,
  classCreatedOk,
  duplicateClassError,
  updateTeachersOk,
  updateStudentsOk,
  ClassDeletedOk
} from "../util/responses";
import { Op } from "sequelize";
import User_Class from "../models/User_Class";
import Questionnaire_Class from "../models/Questionnaire_Class";
import { sequelize } from "../database/database";
env(__dirname + "/../../.env");

export async function getClasses(req, res) {
  try {
    if (!req.headers.token) { return privilegesError(res); }
    
    let classes = await Class.findAll({
      include: [
        Year,
        {
          model: User,
          attributes: ["id", "name", "lastname1", "lastname2", "roleId"],
        },
      ],
    });

    for (let auxClass of classes) {
      let assignedStudents = auxClass.dataValues.users.filter((user) => user.roleId === 3);
      auxClass.assignedStudents = assignedStudents;
      auxClass.dataValues.assignedStudents = assignedStudents;
      let excludeStudentsIds = [];
      assignedStudents.forEach((user) => {
        excludeStudentsIds.push(user.id);
      });
      let availableStudents = await User.findAll({
        attributes: ["id", "name", "lastname1", "lastname2"],
        where: { id: { [Op.notIn]: excludeStudentsIds }, roleId: 3 },
      });
      auxClass.availableStudents = availableStudents;
      auxClass.dataValues.availableStudents = availableStudents;

      auxClass.dataValues.users = auxClass.dataValues.users.filter((user) => user.roleId === 2);
      auxClass.dataValues.assignedStudents = assignedStudents;
      auxClass.users = auxClass.dataValues.users;

      let excludeIds = [];
      auxClass.dataValues.users.forEach((user) => { excludeIds.push(user.id); });
      let availableTeachers = await User.findAll({
        attributes: ["id", "name", "lastname1", "lastname2"],
        where: { id: { [Op.notIn]: excludeIds }, roleId: 2 },
      });
      auxClass.dataValues.availableTeachers = availableTeachers;
      auxClass.availableTeachers = availableTeachers;
    }
    if (classes) { return classesOk(res, classes); }
    
  } catch (e) {
    return serverError(res, e);
  }
}

export async function getClassesByTeacher(req, res) {
  try {
    if (!req.headers.token) { return privilegesError(res); }

    let user = await User.findOne({ where: { token: req.headers.token } });

    if (!user) { privilegesError(res); }
    let classes = await User_Class.findAll({
      include: [{ model: Class, include: [Year] }],
      where: { userId: user.id, type: "PR" },
    });

    if (classes) { classesOk(res, classes); }
  } catch (e) {
    serverError(res, e);
  }
}

export async function getBasicClasses(req, res) {
  try {
    if (!req.headers.token) { return privilegesError(res); }

    let classes = await Class.findAll({ include: [Year] });
    if (classes) { classesOk(res, classes); }
  } catch (e) {
    serverError(res, e);
  }
}

export async function createClass(req, res) {
  const { grade, yearId } = req.body.class;
  try {
    if (!grade || !yearId) { return badRequestError(res) ;}
    let newClass = await Class.create({ grade, yearId, enabled: true });
    let auxClass;

    if (newClass) {
      auxClass = await Class.findOne({
        where: { id: newClass.id },
        include: ["year"],
      });
    }
    return classCreatedOk(res, auxClass);
    
  } catch (e) {
    e.original && e.original.code == "ER_DUP_ENTRY" ? duplicateClassError(res) : serverError(res, e);
  }
}

export async function deleteClass(req, res) {
  const { id } = req.params;
  try {
    if (!id) { return badRequestError(res); }
    else {
      await sequelize.transaction(async (t) => {

        await User_Class.destroy({ where: { classId: id } }, { transaction: t });
        await Questionnaire_Class.destroy({ where: { classId: id } }, { transaction: t });
        await Class.destroy({ where: { id } }, { transaction: t });

        return ClassDeletedOk(res);
      });
    }
  } catch (e) {
    serverError(res, e);
  }
}

export async function updateTeachers(req, res) {
  const { teachers } = req.body;
  const class_id = req.body.class_id;
  try {
    if (!class_id || !teachers) { return badRequestError(res); }
    else {
      const auxClass = await Class.findOne({ where: { id: class_id } });
      if (auxClass) {

        User_Class.destroy({ where: { classId: class_id, type: "PR" } });
        for (let teacher of teachers) {
          await User_Class.create({ userId: teacher.id, classId: class_id, type: "PR" });
        }

        updateTeachersOk(res, teachers);
      } else {
        incorrectCredentialsError(res);
      }
    }
  } catch (e) {
    serverError(res, e);
  }
}

export async function updateStudents(req, res) {
  const { students } = req.body;
  const class_id = req.body.class_id;
  try {
    if (!class_id || !students) { return badRequestError(res); }
    else {
      const auxClass = await Class.findOne({ where: { id: class_id } });
      if (auxClass) {
        User_Class.destroy({ where: { classId: class_id, type: "AL" } });
        for (let student of students) {
          await User_Class.create({ userId: student.id, classId: class_id, type: "AL" });
        }
        updateStudentsOk(res, students);
      } else {
        incorrectCredentialsError(res);
      }
    }
  } catch (e) {
    serverError(res, e);
  }
}
