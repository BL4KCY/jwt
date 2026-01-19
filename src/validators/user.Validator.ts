import ajv from "../lib/Validator";
import userSchema from "../schemas/user.Schema";

const userSignInValidator = ajv.compile({ ...userSchema, required: ["email", "password"] });

const userSignUpValidator = ajv.compile({ ...userSchema, required: ["name", "email", "password"] });

export {userSignInValidator, userSignUpValidator};