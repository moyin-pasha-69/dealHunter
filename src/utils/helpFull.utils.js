import { randomInt } from "node:crypto";
import userModel from "../models/auth.model.js";
function getUserName(first, last) {
  const secrete = new Date();

  const username =
    first.toLocaleLowerCase() +
    (last ? Array.from(last).slice(0, 2).join("") : "hun").toLowerCase() +
    "_" +
    randomInt(1000, 1000000);
  return username;
}

export { getUserName };
