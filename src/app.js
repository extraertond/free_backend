import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";

import usersRoutes from "./routes/users";
import rolesRoutes from "./routes/roles";
import subjectsRoutes from "./routes/subjects";
import yearsRoutes from "./routes/years";
import classesRoutes from "./routes/classes";
import questionnairesRoutes from "./routes/questionnaires";
import { validateApiKey } from "./util/helpers";
import { privilegesError } from "./util/responses";


const app = express();

app.use(morgan("dev"));
app.use(json());
app.use(cors());


 app.use(function (req, res, next) {
    if (validateApiKey(req.headers['x-api-key'])) next();
    else {
      privilegesError(res);
    }
  });
  

app.use("/api/users", usersRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/years", yearsRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/questionnaires", questionnairesRoutes);

export default app;
