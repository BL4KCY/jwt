import ms, { StringValue } from 'ms'

export default function getExpiresAtFromMs(timeString: StringValue): Date {
	const milliseconds = ms(timeString); // Convert '30d' to milliseconds
	return new Date(Date.now() + milliseconds);
}