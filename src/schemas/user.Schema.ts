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
			name: "Username must be 3-15 characters and start with a letter",
			email: "Please provide a valid email address",
			password: "Password must be at least 12 characters with uppercase, lowercase, number, and special character (@$!%*?&)"
		},
		required: {
			name: "Username is required..!",
			email: "Email is required..!",
			password: "Password is required..!"
		}
	}
}

export default userSchema;