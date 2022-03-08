import { Router } from "express";
import { createClass, deleteClass, getBasicClasses, getClasses, getClassesByTeacher, updateStudents, updateTeachers } from "../controllers/class.controller";
import { getRoleByToken } from "../util/helpers";
import { privilegesError, badRequestError } from "../util/responses";
const router = Router();

/**
 * Middleware for routes only accessible by admin.
 */
router.use("/adm", async function (req, res, next) {
  if (!req.headers.token) badRequestError(res);
  else if ((await getRoleByToken(req.headers.token)).dataValues?.name == "admin") next();
  else {
    privilegesError(res);
  }
});

router.get("/", getClasses);
router.get("/basic", getBasicClasses);
router.get("/by_teacher", getClassesByTeacher);
router.post("/adm/update_teachers", updateTeachers);
router.post("/adm/update_students", updateStudents);
router.post("/adm/add", createClass);
router.delete("/adm/:id", deleteClass);
export default router;
