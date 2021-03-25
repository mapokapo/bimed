import { scale, arrayChunks, validateOptions } from "./utils";

export interface EncodeOptions {
	width: number;
	scale?: number;
	inverted?: boolean;
}

export interface DecodeOptions {
	width: number;
	scale?: number;
	inverted?: boolean;
}

export const encode = (binary: string, _options: EncodeOptions): number[] => {
	validateOptions.encode(binary, _options); // Throws formatted error message and gracefully exits if options are invalid
	const options = {
		width: _options.width,
		scale: _options.scale || 1,
		inverted: _options.inverted || false,
	};

	let result = binary
		.split("")
		.map(
			(char) =>
				(options.inverted ? (parseInt(char) === 0 ? 1 : 0) : parseInt(char)) *
				255,
		);
	while (
		result.length <
		Math.ceil(result.length / options.width) * options.width
	) {
		result.push(0);
	}

	result = result.map((n) => new Array<number>(3).fill(n)).flat();
	result = arrayChunks(result, options.width * 3)
		.flatMap((row) => new Array<number[]>(options.scale).fill(row))
		.map((row) => row.flatMap((n) => new Array<number>(options.scale).fill(n)))
		.flat();

	return result.flat();
};

export const decode = (values: number[], _options: DecodeOptions): string => {
	validateOptions.decode(values, _options); // Throws formatted error message and gracefully exits if options are invalid
	const options = {
		width: _options.width,
		scale: _options.scale || 1,
		inverted: _options.inverted || false,
	};

	// Multiply total width by 3 because we're dealing with RGB values (3 values in a row represent a single pixel)
	const width = options.width * 3 * options.scale;

	// Fix any image encoding errors (eg. 246 will turn into 255, which turns into 1)
	// Also split up the result bits into chunks of size "width", which effectively splits them up in rows of image pixels
	let result: string[] = arrayChunks(
		values.map((n) => Math.round(scale(n, 0, 255, 0, 1)).toString()),
		width,
	)
		// Keeps every nth bit from the data, where n = options.scale, discards all other rows which will be duplicates
		// Does nothing if options.scale = 1, i.e. no duplicate rows
		.filter((_, index) => (index + 1) % options.scale === 0)
		.map((row) =>
			// Split each row into chunks of 3 bits (RGB values) and combine them into a single value that represents binary data (i.e. 111 becomes 1)
			arrayChunks(row, 3 * options.scale)
				.map((chunk) => {
					if (
						JSON.stringify(chunk) ===
						JSON.stringify(new Array(3 * options.scale).fill("1"))
					)
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
