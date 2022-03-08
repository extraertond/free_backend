import env from "node-env-file";
import Subject from "../models/Subject";
import {
  serverError,
  subjectsOk,
  privilegesError,
  badRequestError,
  updateSubjectOk,
  subjectCreatedOk,
  duplicateSubjectError,
} from "../util/responses";
env(__dirname + "/../../.env");

export async function getSubjects(req, res) {
  try {
    if (!req.headers.token) return privilegesError(res);
    const subjects = await Subject.findAll();
    if (subjects) subjectsOk(res, subjects);
    
  } catch (e) {
    serverError(res, e);
  }
}

 export async function getEnabledSubjects(req, res) {
  try {
    if (!req.headers.token) return privilegesError(res);

    let subjects = await Subject.findAll({where: {enabled: true}});
    if (subjects) subjectsOk(res, subjects);
    
  } catch (e) {
    serverError(res, e);
  }
}

export async function updateSubject(req, res) {
  const { id, name, enabled } = req.body.subject;
  try {
    if (!id || !name || enabled == undefined) return badRequestError(res);
    const subject = await Subject.findOne({
      attributes: ["id", "name", "enabled"],
      where: { id },
    });
    if (subject) {
      await subject.update({
        enabled: enabled,
        name: name,
      });
      updateSubjectOk(res, subject);
    } else {
      incorrectCredentialsError(res);
    }  
  } catch (e) {
    serverError(res, e);
  }
}

export async function createSubject(req, res) {
  const { name } = req.body.subject;
  try {
    if (!name) return badRequestError(res);
    
    let newSubject = await Subject.create({ name, enabled: true });
    if (newSubject) subjectCreatedOk(res, newSubject);
  } catch (e) {
    e.original && e.original.code == "ER_DUP_ENTRY" ? duplicateSubjectError(res) : serverError(res, e);
  }
}
