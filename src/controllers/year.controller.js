import env from "node-env-file";
import Year from "../models/Year";
import { serverError, yearsOk, privilegesError } from "../util/responses";
env(__dirname + "/../../.env");

export async function getYears(req, res) {
  try {
    if (!req.headers.token) return privilegesError(res);

    let years = await Year.findAll();
    if (years) yearsOk(res, years);

  } catch (e) {
    serverError(res, e);
  }
}
