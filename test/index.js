// eslint-disable-next-line @typescript-eslint/no-var-requires
const { encode, decode } = require("../dist").default;

const binary = "1111000011000011";
console.log(`Input binary: ${binary}`);

const encoded = encode(binary, {
	width: 4,
	scale: 2,
});
console.log(`Encoded data: ${encoded}`);

const decoded = decode(encoded, {
	width: 4,
	scale: 2,
});
console.log(decoded);
if (decoded === binary) {
	console.log("Test successful");
}
