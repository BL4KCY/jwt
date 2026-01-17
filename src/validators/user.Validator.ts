import ajv from "../lib/Validator.js";
import userSchema from "../schemas/user.Schema.js";

const userValidator = ajv.compile(userSchema);

export default userValidator;