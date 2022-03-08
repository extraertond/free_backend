import md5 from "md5";
import env from "node-env-file";
import User from "../models/User";
import Role from "../models/Role";
import { checkRolePrivilege, encryptPassword, matchPassword } from "../util/helpers";
import {
  serverError,
  duplicateUsernameError,
  incorrectCredentialsError,
  updatePassOk,
  userCreatedOk,
  loginOk,
  userResetOk,
  incorrectToken,
  badRequestError,
  nonExistUsernameError,
  usersOk,
  privilegesError,
  userDeletedOk,
} from "../util/responses";
import Class from "../models/Class";
import Year from "../models/Year";
import User_Class from "../models/User_Class";
import Answer from "../models/Answer";
import { sequelize } from "../database/database";
import Questionnaire from "../models/Questionnaire";
env(__dirname + "/../../.env");

export async function createUser(req, res) {
  const { role, name, lastname1, lastname2, username, password } = req.body.user;
  try {
    if (!role || !name || !username || !password) return badRequestError(res);

    const newUser = await User.create({
      roleId: (await Role.findOne({ attributes: ["id"], where: { name: role } })).id,
      name,
      lastname1,
      lastname2,
      username,
      password: await encryptPassword(password),
      token: await md5(username + ";" + name + ";" + process.env.SALT_CODE),
    });
    if (newUser) userCreatedOk(res, newUser);
  } catch (e) {
    e.original && e.original.code == "ER_DUP_ENTRY" ? duplicateUsernameError(res) : serverError(res, e);
  }
}

export async function loginUser(req, res) {
  const { username, password } = req.body.user;
  try {
    if (!username || !password) {
      return badRequestError(res);
    }
    const user = await User.findOne({
      attributes: ["name", "lastname1", "lastname2", "username", "password", "token", "initialized"],
      where: { username },
      include: ["role"],
    });
    if (user && (await matchPassword(password, user.password)))
      loginOk(res, {
        name: user.name,
        lastname1: user.lastname1,
        lastname2: user.lastname2,
        username: user.username,
        token: user.token,
        initialized: user.initialized,
      });
    else {
      incorrectCredentialsError(res);
    }

  } catch (e) {
    serverError(res, e);
  }
}

export async function data(req, res) {
  if (!req.headers.token) { return res.send(); }
    try {
      const user = await User.findOne({
        attributes: ["name", "lastname1", "lastname2", "username", "token", "initialized"],
        where: { token: req.headers.token },
        include: ["role"],
      });

      if (user) {
        loginOk(res, user);
      } else {
        incorrectToken(res);
      }
    } catch (e) {
      serverError(res, e);
    }
}

export async function changePassword(req, res) {
  const { username, password, newPassword } = req.body.user;
  try {
    if (!username || !password || !newPassword) return badRequestError(res);
    const user = await User.findOne({
      attributes: ["id", "name", "lastname1", "lastname2", "username", "token", "password", "initialized", "roleId"],
      where: { username },
    });
    if (user && (await matchPassword(password, user.password))) {
      await user.update({
        password: await encryptPassword(newPassword),
        initialized: true,
      });
      updatePassOk(res);
    } else {
      incorrectCredentialsError(res);
    }
  } catch (e) {
    serverError(res, e);
  }
}

export async function resetPassword(req, res) {
  const { username } = req.body.user;
  try {
    if (!username) return badRequestError(res);

    const user = await User.findOne({
      attributes: ["id", "roleId", "name", "lastname1", "lastname2", "username", "token", "password", "initialized"],
      where: { username },
    });
    if (user) {
      await user.update({
        password: await encryptPassword(process.env.TEMP_PASS),
        initialized: false,
      });
      userResetOk(res, user);
    } else {
      nonExistUsernameError(res);
    }
  } catch (e) {
    serverError(res, e);
  }
}

export async function getTeachers(req, res) {
  try {
    if (!req.headers.token) return privilegesError(res);
    let teachers = await User.findAll({
      attributes: ["id", "name", "lastname1", "lastname2", "username"],
      where: { roleId: 2 },
    });
    if (teachers) usersOk(res, teachers);
  } catch (e) {
    serverError(res, e);
  }
}

export async function getStudents(req, res) {
  try {
    if (!req.headers.token || !(await checkRolePrivilege(req.headers.token, "teacher"))) return privilegesError(res);

    let students = await User.findAll({
      attributes: ["id", "name", "lastname1", "lastname2", "username"],
      where: { roleId: 3 },
    });
    if (students) usersOk(res, students);

  } catch (e) {
    serverError(res, e);
  }
}

export async function getStudentsByTeacherClass(req, res) {
  try {
    if (!req.headers.token || !(await checkRolePrivilege(req.headers.token, "student"))) return privilegesError(res);
    let students = await User.findAll({
      attributes: ["name", "lastname1", "lastname2", "username", "id"],
      where: { roleId: 3 },
      include: [
        Class,
        {
          model: Class,
          include: [Year],
        },
      ],
    });
    if (students) usersOk(res, students);
  } catch (e) {
    serverError(res, e);
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    if (!id) return badRequestError(res);

    await sequelize.transaction(async (t) => {
      await User_Class.destroy({ where: { userId: id } }, { transaction: t });
      await Answer.destroy({ where: { userId: id } }, { transaction: t });
      await Questionnaire.update({userId: 1}, { where: { userId: id } }, { transaction: t });
      await User.destroy({ where: { id } }, { transaction: t });
      return userDeletedOk(res);
    });

  } catch (e) {
    serverError(res, e);
  }
}
