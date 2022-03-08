import { Router } from "express";
import {
  changeRemake,
  changeReviewable,
  changeViewgrade,
  changeVisibility,
  correctQuestionnaire,
  createQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaireForStudent,
  getQuestionnaireForTeacher,
  getQuestionnairesForStudents,
  getQuestionnairesForTeachers,
  updateQuestionnaire,
  getRevisionForStudent,
  getGradesByQuestionnaire,
  getGradesByUser
} from "../controllers/questionnaire.controller";
import { getRoleByToken } from "../util/helpers";
import { privilegesError, badRequestError } from "../util/responses";
const router = Router();

/**
 * Middleware for routes only accessible by teachers.
 */
router.use("/tch", async function (req, res, next) {
  if (!req.headers.token) badRequestError(res);
  else if ((await getRoleByToken(req.headers.token)).dataValues?.name == "teacher") next();
  else {
    privilegesError(res);
  }
});

router.get("/tch", getQuestionnairesForTeachers);
router.get("/std", getQuestionnairesForStudents);
router.get("/tch/questionnaire/:id", getQuestionnaireForTeacher);
router.get("/std/questionnaire/:id", getQuestionnaireForStudent);
router.get("/std/revision/:id", getRevisionForStudent);
router.post("/std/correct", correctQuestionnaire);
router.post("/tch/add", createQuestionnaire);
router.get("/std/user/:id/grades", getGradesByUser);
router.put("/tch/update", updateQuestionnaire);
router.patch("/tch/change_visible", changeVisibility);
router.patch("/tch/change_reviewable", changeReviewable);
router.patch("/tch/change_can_remake", changeRemake);
router.patch("/tch/change_view_grade", changeViewgrade);
router.delete("/tch/delete/:id", deleteQuestionnaire);
router.get("/tch/questionnaire/:id/grades", getGradesByQuestionnaire);

export default router;
