import { Router } from "express";
const router = Router();
import {
  changePassword,
  resetPassword,
  createUser,
  loginUser,
  data,
  getStudents,
  getTeachers,
  getStudentsByTeacherClass,
  deleteUser,
} from "../controllers/user.controller";
import { checkRolePrivilege, getRoleByToken } from "../util/helpers";
import { privilegesError, badRequestError } from "../util/responses";

router.use("/r1", async function (req, res, next) {
  if (!req.headers.token) badRequestError(res);
  else if (await checkRolePrivilege(req.headers.token, req.body.user.role)) next();
  else {
    privilegesError(res);
  }
});

router.use("/adm", async function (req, res, next) {
  if (!req.headers.token) badRequestError(res);
  else if ((await getRoleByToken(req.headers.token))?.dataValues?.name === "admin") next();
  else {
    privilegesError(res);
  }
});

router.post("/r1/create", createUser);
router.post("/login", loginUser);
router.post("/data", data);
router.post("/change_password", changePassword);
router.post("/adm/reset_password", resetPassword);
router.delete("/adm/:id", deleteUser);
router.get("/adm/teachers", getTeachers);
router.get("/students", getStudents);
router.get("/students_by_class", getStudentsByTeacherClass);
export default router;
