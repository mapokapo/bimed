import { interpolate, arrayChunks, validator } from "./utils";

/**
 * The encoding options.
 */
export interface EncodeOptions {
	/**
	 * Whether the input bits should be inverted (1 becomes 0, 0 becomes 1).
	 *
	 * @default false
	 */
	inverted?: boolean;
	/**
	 * By how much to scale up the resulting raw RGB data. This multiplies every value as well as every row of the data.
	 *
	 * eg. if scale is 2, that means there will be twice as many rows, and twice as many bytes in each row.
	 *
	 * @default 1
	 */
	scale?: number;
	/**
	 * How many bits are needed to fill up a single row with raw RGB data.
	 *
	 * eg. if width is 4, that means the raw RGB data for a single row of pixels with a scale of 1 will have 12 bytes.
	 *
	 * @default 1
	 */
	width?: number;
}

export interface DecodeOptions {
	/**
	 * Whether the input bytes should be inverted (0-127 becomes 1, 128-256 becomes 0).
	 *
	 * @default false
	 */
	inverted?: boolean;
	/**
	 * By how much to scale down the input raw RGB data. This keeps every nth row as well as every nth byte in each row, where n = scale, and discards the rest.
	 *
	 * eg. if scale is 2, that means there will be half as as many rows, and half as many bytes in each row. If the input bytes have also been scaled up by 2, this means the resulting bits will be properly scaled and there won't be any duplicated.
	 *
	 * @default 1
	 */
	scale?: number;
	/**
	 * How many bits are needed to fill up a single row with raw RGB data.
	 *
	 * eg. if width is 4, that means the raw RGB data for a single row of pixels with a scale of 1 will have 12 bytes.
	 *
	 * @default 1
	 */
	width?: number;
}

/**
 * Encodes a string containing bits to an array of raw RGB values.
 *
 * @param binary The string containing the bits.
 * @param options The encoding options.
 * @returns The encoded raw RGB data.
 *
 * @example
 * const encoded = encode("1111000011000011", { width: 2, scale: 2, inverted: true });
 * console.log(encoded); // Number of bytes = 192. Each row represents 2 bits = 12 bytes per row. Height (in pixels) is number of bytes / bytes per row = 16
 */
export const encode = (binary: string, options?: EncodeOptions): number[] => {
	validator.encode(binary, options); // Throws formatted error message and gracefully exits if options are invalid.
	const _options = {
		width:
			options !== undefined && options.width !== undefined ? options.width : 1,
		scale:
			options !== undefined && options.scale !== undefined ? options.scale : 1,
		inverted:
			options !== undefined && options.inverted !== undefined
				? options.inverted
				: false,
	};

	// Map each bit to a byte (0-127 = 0, 128-255 = 1), or invert them if options.inverted was specified.
	let result = binary
		.split("")
		.map(
			(char) =>
				(_options.inverted ? (parseInt(char) === 0 ? 1 : 0) : parseInt(char)) *
				255,
		);

	// If the amount of bytes can't completely fill up an image of width options.width (spaces left empty), then put 0s in the empty spaces.
	// eg. if the amount of suppled bits is 15, and the width is 4, the minimum amount of bits required to fill that space is 16. Since 1 bit is missing, we put a 0 in its place.
	while (
		result.length <
		Math.ceil(result.length / _options.width) * _options.width
	) {
		result.push(0);
	}

	// "Inflate" the array - each bytes gets tripled to represent an RGB value.
	result = result.map((n) => new Array<number>(3).fill(n)).flat();
	// Scale each row to be of size row.length * options.scale (3 bytes in a row * options.scale: 3 => 9 bytes).
	// Also duplicate rows 'options.scale' amount of times (1 row * options.scale: 3 => 3 rows).
	result = arrayChunks(result, _options.width * 3)
		.flatMap((row) => new Array<number[]>(_options.scale).fill(row))
		.map((row) => row.flatMap((n) => new Array<number>(_options.scale).fill(n)))
		.flat();

	// Flatten the array so that it contains raw, unordered RGB data.
	return result.flat();
};

/**
 * Decodes an array containing raw RGB data to a string containing 0s and 1s which represent the black and white pixels.
 *
 * @param values An array containing the raw RGB data
 * @param options The decoding options.
 * @returns A string containing bits that represent white or black pixels.
 *
 * @example
 * const encoded = encode("1111000011000011", { width: 2, scale: 2, inverted: true });
 * const decoded = decode(encoded, { width: 2, scale: 2, inverted: true });
 * console.log(decoded); // "1111000011000011"
 */
export const decode = (values: number[], options?: DecodeOptions): string => {
	validator.decode(values, options); // Throws formatted error message and gracefully exits if options are invalid.
	const _options = {
		width:
			options !== undefined && options.width !== undefined ? options.width : 1,
		scale:
			options !== undefined && options.scale !== undefined ? options.scale : 1,
		inverted:
			options !== undefined && options.inverted !== undefined
				? options.inverted
				: false,
	};

	// Width of a single row, multiplied by 3 because we're dealing with RGB values (3 values in a row represent a single pixel).
	// Also scaled up by options.scale.
	const width = _options.width * 3 * _options.scale;

	// Map bytes to bits (0-127 = 0, 128-255 = 1).
	// Also split up the result bits into chunks of size 'width', which effectively splits them up in rows of image pixels.
	let result: string[] = arrayChunks(
		values.map((n) => Math.round(interpolate(n, 0, 255, 0, 1)).toString()),
		width,
	)
		// Keeps every nth bit from the data, where n = options.scale, and discards all other bits which will be duplicates.
		// Does nothing if options.scale = 1, i.e. no duplicate rows.
		.filter((_, index) => (index + 1) % _options.scale === 0)
		// Split each row into chunks of 3 bits and combine them into a single bit (eg. 111 becomes 1).
		.map((row) =>
			arrayChunks(row, 3 * _options.scale)
				.map((chunk) => {
					// JSON.stringify is the easiest way to check if the 2 arrays are equal.
					if (
						JSON.stringify(chunk) ===
						JSON.stringify(new Array(3 * _options.scale).fill("1"))
					)
						return "1";
					else return "0";
				})
				.join(""),
		);

	// Reverse every bit if options.inverted was specified.
	if (_options.inverted)
		result = result.map((row) =>
			row
				.split("")
				.map((char) => (char === "0" ? "1" : "0"))
				.join(""),
		);

	// Turn the array into a string.
	return result.join("");
};
