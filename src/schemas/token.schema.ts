import { JSONSchemaType } from "ajv";
import { RefreshToken } from "../interfaces/token.Interface";



const tokenSchema: JSONSchemaType<RefreshToken> = {
	type: "object",
	properties: {
		refreshToken: {type: "string", format: 'jsonwebtoken'}
	},
	required: ["refreshToken"],
	additionalProperties: false,
	errorMessage: {
		properties: {
			refreshToken: "`refreshToken` must be a valid JWT token."
		},
		required: {
			name: "`refreshToken` is required..!",
		}
	}
}



export default tokenSchema

