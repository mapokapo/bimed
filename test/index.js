// eslint-disable-next-line @typescript-eslint/no-var-requires
const { encode, decode } = require("../dist").default;

let eBits = "1111000011000011";
console.log(`\n  * Input bits: ${eBits}`);
const eInverted = true;
const eScale = 2;
const eWidth = 2;
console.log(`\n1. Encoding options:
  - inverted: ${eInverted}
  - scale: ${eScale}
  - width: ${eWidth}\n`);

if (eBits.length < Math.ceil(eBits.length / eWidth) * eWidth) {
	console.log(
		`  * Note: There are ${
			eBits.length
		} input bits but the required amount is ${
			Math.ceil(eBits.length / eWidth) * eWidth
		}. The encode method will automatically add extra 0s until the required length is reached, but that means the input and output bits in this test will be different. Adding the extra 0s will make the test run successfully. Will add extra 0s until required length is reached...`,
	);
	while (eBits.length < Math.ceil(eBits.length / eWidth) * eWidth) {
		eBits += "0";
	}
	console.log(`  * Input bits padded, new input bits: ${eBits}`);
}

const encoded = encode(eBits, {
	inverted: eInverted,
	scale: eScale,
	width: eWidth,
});
console.log(`  * Encoded data length: ${encoded.length}`);

const dInverted = eInverted;
const dScale = eScale;
const dWidth = eWidth;
console.log(`\n2. Decoding options:
  - inverted: ${dInverted}
  - scale: ${dScale}
  - width: ${dWidth}`);
const decoded = decode(encoded, {
	inverted: dInverted,
	scale: dScale,
	width: dWidth,
});
console.log(`\n  * Decoded data: ${decoded}`);

if (eBits === decoded) {
	console.log(
		`\nTest successful! Input bits (${eBits}) are equal to the decoded bits (${decoded}).\n`,
	);
} else {
	console.log(
		`\nTest failed. Input bits (${eBits}) and decoded bits ${decoded} aren't the same. Something has went wrong. Please report this issue to the package maintainer.\n`,
	);
}
