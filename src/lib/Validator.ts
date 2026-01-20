import Ajv, { Format } from "ajv"
import addFormats from "ajv-formats"
import addErrors from 'ajv-errors'

const ajv = new Ajv({allErrors: true, useDefaults: true});
addFormats(ajv);
addErrors(ajv)

const formats = {
	username: /^[a-zA-Z][a-zA-Z0-9_.-]{2,19}$/,
	password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/,
	phoneNumber: /^\+?[1-9]\d{7,14}$/,
	jsonwebtoken: /e[yw][A-Za-z0-9-_]+\.(?:e[yw][A-Za-z0-9-_]+)?\.[A-Za-z0-9-_]{2,}(?:(?:\.[A-Za-z0-9-_]{2,}){2})?/
}
Object.entries(formats).forEach(([name, format]) => {
	ajv.addFormat(name, format)
})

export default ajv
