import Role from "../models/Role";
import { rolesOk } from "../util/responses";

export async function getRoles(_, res) {
  try {
    const roles = await Role.findAll();
    rolesOk(res, roles);
  } catch (e) {
    serverError(res, e);
  }
}
