import { scale, stringChunks, validateOptions } from "./utils";

export interface EncodeOptions {
	width: number;
	scale?: number;
	inverted?: boolean;
}

export interface DecodeOptions {
	width: number;
	scale: number;
	inverted?: boolean;
}

export const encode = (binary: string, options: EncodeOptions): number[] => {
	const error = validateOptions.encode(binary, options);
	if (error) {
		console.error(error.message);
		process.exit(0);
	}

	let result = binary.split("").map((char) => parseInt(char) * 255);
	while (
		result.length <
		Math.ceil(result.length / options.width) * options.width
	) {
		result.push(0);
	}
	if (options.inverted) {
		result = result.map((n) => (n === 255 ? 0 : 255));
	}
	return result;
};

export const decode = (values: number[], options: DecodeOptions): string => {
	const error = validateOptions.decode(values, options);
	if (error) {
		console.error(error.name + ": " + error.message);
		process.exit(0);
	}

	// Multiply total width by 3 because we're dealing with RGB values (3 values in a row represent a single pixel)
	const width = options.width * options.scale * 3;

	// Fix any image encoding errors (eg. 246 will turn into 255, which turns into 1)
	// Also split up the result bits into chunks of size "width", which effectively splits them up in rows of image pixels
	let result: string[] = stringChunks(
		values.map((n) => Math.round(scale(n, 0, 255, 0, 1)).toString()).join(""),
		width,
	)
		// Keeps every nth row from the data, where n = options.scale, discards all other rows which will be duplicates
		// Does nothing if options.scale = 1, i.e. no duplicate rows
		.filter((_, index) => (index + 1) % options.scale === 0)
		.map((row) =>
			// Split each row into chunks of 3 bits (RGB values) and combine them into a single value that represents binary data (i.e. 111 becomes 1)
			stringChunks(row, 3 * options.scale)
				.map((chunk) => {
					if (chunk === new Array(3 * options.scale).fill("1").join(""))
						return "1";
					else return "0";
				})
				.join(""),
		);

	if (options.inverted)
		result = result.map((row) =>
			row
				.split("")
				.map((char) => (char === "0" ? "1" : "0"))
				.join(""),
		);

	return result.join("");
};
