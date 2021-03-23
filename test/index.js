// eslint-disable-next-line @typescript-eslint/no-var-requires
const { encode, decode } = require("../dist/index");

const binary = "1111000011000011";
console.log(binary);

const encoded = encode(binary, {
	width: 16,
	inverted: true,
});
console.log(encoded);

const decoded = decode(encoded, {
	inverted: true,
});
console.log(decoded);
if (decoded === binary) {
	console.log("Test successful");
}
