import { JSONSchemaType } from "ajv";
import { User } from "../interfaces/user.Interface";


const userSchema: JSONSchemaType<User> = {
	type: "object",
	properties: {
		name: { type: "string", minLength: 3, maxLength: 15, format: "username"},
		email: { type: "string", format: "email"},
		password: { type: "string", format: "password", minLength: 12}
	},
	required: ["name", "email", "password"],
	additionalProperties: false,
	errorMessage: {
		properties: {
			password: "test"
		}
	}
}

export default userSchema;