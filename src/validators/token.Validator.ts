import ajv from "../lib/Validator";
import tokenSchema from "../schemas/token.schema";

const tokenValidator = ajv.compile(tokenSchema);

export {tokenValidator};