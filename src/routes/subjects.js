import { Router } from "express";
import { createSubject, getEnabledSubjects, getSubjects, updateSubject } from "../controllers/subject.controller";
import { getRoleByToken } from "../util/helpers";
import { privilegesError, badRequestError } from "../util/responses";
const router = Router();

/**
 * Middleware for routes only accessible by admin.
 */
router.use("/adm", async function (req, res, next) {
  if (!req.headers.token) badRequestError(res);
  else if ((await getRoleByToken(req.headers.token)).dataValues.name == "admin") next();
  else {
    privilegesError(res);
  }
});

router.get("/", getSubjects);
router.get("/enabled", getEnabledSubjects);
router.put("/adm/edit", updateSubject);
router.post("/adm/add", createSubject);
export default router;
