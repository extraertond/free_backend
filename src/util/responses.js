/**
 * @author Néstor Fernández <extraertond@gmail.com>
 */
import env from "node-env-file";
env(__dirname + "/../../.env");

/*** OKS ***/
/**
 * Predefined response if the subjects petition was successful.
 * @param {*} res
 * @param {*} newUser the new user created
 */
export function subjectsOk(res, subjects) {
  return res.status(200).json({
    message: "Asignaturas obtenidas",
    code: "OK",
    data: {
      subjects,
    },
  });
}
/**
 * Predefined response if the classes petition was successful.
 * @param {*} res
 * @param {*} classes the new user created
 */
export function classesOk(res, classes) {
  return res.status(200).json({
    message: "Clases obtenidas",
    code: "OK",
    data: {
      classes,
    },
  });
}
/**
 * Predefined response if the classes petition was successful.
 * @param {*} res
 * @param {*} teachers the new user created
 */
export function updateTeachersOk(res, teachers) {
  return res.status(200).json({
    message: "Profesores de clase actualizados",
    code: "OK",
    data: {
      teachers,
    },
  });
}
/**
 * Predefined response if the classes petition was successful.
 * @param {*} res
 * @param {*} teachers the new user created
 */
export function updateStudentsOk(res, students) {
  return res.status(200).json({
    message: "Alumnos de clase actualizados",
    code: "OK",
    data: {
      students,
    },
  });
}
/**
 * Predefined response if user login was successful.
 * @param {*} res
 * @param {*} user the user who logs in
 */
export function loginOk(res, user) {
  return res.status(200).json({
    message: user.initialized
      ? "Se ha conectado a su cuenta correctamente"
      : "Debe cambiar la contraseña obligatoriamente",
    code: user.initialized ? "OK" : "WARN",
    data: {
      name: user.name,
      lastname1: user.lastname1,
      lastname2: user.lastname2,
      token: user.token,
      role: user.role,
      username: user.username,
      initialized: user.initialized,
    },
  });
}
/**
 * Predefined response if subject update succeeded.
 * @param {*} res
 */
export function updateSubjectOk(res, subject) {
  return res.status(200).json({
    message: "Asignatura actualizada correctamente",
    code: "OK",
    data: { subject },
  });
}
/**
 * Predefined response if subject update succeeded.
 * @param {*} res
 */
export function usersOk(res, users) {
  return res.status(200).json({
    message: "Usuarios obtenidos correctamente",
    code: "OK",
    data: { users },
  });
}
/**
 * Predefined response if user password update succeeded.
 * @param {*} res
 */
export function updatePassOk(res) {
  return res.status(200).json({
    message: "Contraseña actualizada correctamente",
    code: "OK",
    data: {},
  });
}
/**
 * Predefined response if the user creation succeeded.
 * @param {*} res
 * @param {*} newUser the new user created
 */
export function userCreatedOk(res, newUser) {
  return res.status(200).json({
    message: "Usuario creado",
    code: "OK",
    data: {
      id: newUser.id,
      name: newUser.name,
      lastname1: newUser.lastname1,
      lastname2: newUser.lastname2,
      username: newUser.username,
    },
  });
}
/**
 * Predefined response if the subject creation succeeded.
 * @param {*} res
 * @param {*} newUser the new user created
 */
export function subjectCreatedOk(res, newSubject) {
  return res.status(200).json({
    message: "Asignatura creada",
    code: "OK",
    data: { subject: newSubject },
  });
}
/**
 * Predefined response if the subject creation succeeded.
 * @param {*} res
 * @param {*} newUser the new user created
 */
export function classCreatedOk(res, newClass) {
  return res.status(200).json({
    message: "Clase creada",
    code: "OK",
    data: { class: newClass },
  });
}
/**
 * Predefined response if the user password has been reset correctly.
 * @param {*} res
 * @param {*} user the user whose password has been reset
 */
export function userResetOk(res, user) {
  return res.status(200).json({
    message: "Se ha reseteado el usuario correctamente",
    code: "OK",
    data: {
      name: user.name,
      lastname1: user.lastname1,
      lastname2: user.lastname2,
      username: user.username,
    },
  });
}

export function rolesOk(res, roles) {
  return res.status(200).json({
    message: "Roles obtenidos con éxito",
    code: "OK",
    data: {
      roles,
    },
  });
}

export function yearsOk(res, years) {
  return res.status(200).json({
    message: "Cursos obtenidos con éxito",
    code: "OK",
    data: {
      years,
    },
  });
}

export function getQuestionnairesForTeachersOk(res, questionnaires) {
  return res.status(200).json({
    message: "Cuestionarios para profesores obtenidos con éxito",
    code: "OK",
    data: {
      questionnaires,
    },
  });
}

export function getQuestionnairesForStudentsOk(res, questionnaires) {
  return res.status(200).json({
    message: "Cuestionarios para alumnos obtenidos con éxito",
    code: "OK",
    data: {
      questionnaires,
    },
  });
}

export function getQuestionnaireForTeachersOk(res, questionnaire) {
  return res.status(200).json({
    message: "Cuestionario para profesores obtenido con éxito",
    code: "OK",
    data: {
      questionnaire,
    },
  });
}

export function getQuestionnaireForStudentsOk(res, questionnaire) {
  return res.status(200).json({
    message: "Cuestionario para alumnos obtenidos con éxito",
    code: "OK",
    data: {
      questionnaire,
    },
  });
}

export function getRevisionForStudentsOk(res, revision) {
  return res.status(200).json({
    message: "Revisión para alumnos obtenida con éxito",
    code: "OK",
    data: {
      revision,
    },
  });
}

export function getGradesOk(res, grades) {
  return res.status(200).json({
    message: "Notas para profesores obtenido con éxito",
    code: "OK",
    data: {
      grades,
    },
  });
}

/**
 * Predefined response if the questionnaire creation succeeded.
 * @param {*} res
 */
export function questionnaireCreatedOk(res) {
  return res.status(200).json({
    message: "Cuestionario creado",
    code: "OK",
  });
}

export function questionnaireUpdatedOk(res) {
  return res.status(200).json({
    message: "Cuestionario actualizado",
    code: "OK",
  });
}

export function questionnaireDeletedOk(res) {
  return res.status(200).json({
    message: "Cuestionario eliminado",
    code: "OK",
  });
}

export function userDeletedOk(res) {
  return res.status(200).json({
    message: "Usuario eliminado",
    code: "OK",
  });
}

export function ClassDeletedOk(res) {
  return res.status(200).json({
    message: "Clase eliminada",
    code: "OK",
  });
}

export function answerCreateOk(res) {
  return res.status(200).json({
    message: "Cuestionario corregido",
    code: "OK",
  });
}
/*** ERRORS ***/
/**
 * Predefined response if the server doesn't work correctly.
 * @param {*} res
 * @param {error} e the caught error
 */
export function serverError(res, e) {
  console.log(e);
  return res.status(500).json({
    message: "Error del servidor, inténtelo más tarde",
    code: "ERROR",
    data: {},
  });
}
/**
 * Predefined response if the user try to do any action without sufficient privileges.
 * @param {*} res
 */
export function privilegesError(res) {
  return res.status(403).json({
    message: "No tiene permisos suficientes",
    code: "ERROR",
    data: {},
  });
}
/**
 * Predefined response if the request is bad.
 * @param {*} res
 */
export function badRequestError(res) {
  return res.status(400).json({
    message: "Petición mal formada",
    code: "ERROR",
    data: {},
  });
}
/**
 * Predefined response if the user try to create a new user with a existent username.
 * @param {*} res
 */
export function duplicateUsernameError(res) {
  return res.status(400).json({
    message: "Nombre de usuario ya registrado",
    code: "ERROR",
    data: {},
  });
}
/**
 * Predefined response if the user try to create a new subject with a existent name.
 * @param {*} res
 */
export function duplicateSubjectError(res) {
  return res.status(200).json({
    message: "Nombre de asignatura ya registrado",
    code: "DUPLICATE",
    data: {},
  });
}
/**
 * Predefined response if the user try to create a new subject with a existent name.
 * @param {*} res
 */
export function duplicateClassError(res) {
  return res.status(200).json({
    message: "Clase ya registrada (mismo curso academico y curso)",
    code: "DUPLICATE",
    data: {},
  });
}
/**
 *
 * @param {*} res
 */
export function incorrectCredentialsError(res) {
  return res.status(404).json({
    message: "Usuario o contraseña incorrectos",
    code: "ERROR",
    data: {},
  });
}

/**
 *
 * @param {*} res
 */
export function nonExistUsernameError(res) {
  return res.status(404).json({
    message: "Nombre de usuario no encontrado",
    code: "ERROR",
    data: {},
  });
}

export function incorrectToken(res) {
  return res.status(404).json({
    message: "Token de sesión inválido",
    code: "ERROR",
    data: {},
  });
}
