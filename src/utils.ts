import path from "path";
import fs from "fs";
import { DecodeOptions, EncodeOptions } from "./transform";

/**
 *
 * @param arr Array of items.
 * @param chunkSize Size of a single chunk.
 * @returns An array containing arrays which all collectively contain the original items in the same order, just one level deeper.
 *
 * @example
 * const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
 * const chunks = arrayChunks(array, 3);
 * console.log(chunks); // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
 */
export const arrayChunks = <T>(arr: T[], chunkSize: number): T[][] => {
	const chunks = [];
	const n = arr.length;

	let i = 0;
	while (i < n) {
		chunks.push(arr.slice(i, (i += chunkSize)));
	}

	return chunks;
};

/**
 * Simply checks whether a file exists or not.
 *
 * @param path The path of the file on the filesystem.
 * @returns True if the file exists, otherwise false.
 */
export const fileExists = (path: string): boolean => {
	return fs.existsSync(path);
};

/**
 * Checks whether an input string is binary (i.e. contains only 1s and 0s).
 *
 * @param str A string that may or may not contains only 1s and 0s.
 * @returns True if the string contains only 1s and 0s and if the amount of characters in the string is greater than 0, otherwise false.
 *
 * @example
 * const string1 = "1111a";
 * const string2 = "1111000011000011";
 * console.log(isBitString(string1), isBitString(string2)); // false, true
 */
export const isBitString = (str: string): boolean => {
	const arr = str.split("");
	return arr.length > 0 && arr.every((char) => char === "0" || char === "1");
};

/**
 * Checks whether an input array contains bytes (i.e. contains values ranging 0-255).
 *
 * @param values An array that may or may not contain raw RGB data (bytes).
 * @returns True if the array contains positive integers greater than or equal to 0, and less than or equal to 255.
 *
 * @example
 * const array1 = ["a", -1];
 * const array2 = [0, 255, 123, 245];
 * console.log(isByteArray(array1), isByteArray(array2)); // false, true
 */
export const isByteArray = (values: number[]): boolean => {
	return values.every(
		(n) => !isNaN(n) && !n.toString().includes(".") && n >= 0 && n <= 255,
	);
};

/**
 * Interpolates a number that ranges from minA - maxA to a new number which ranges from minB - maxB
 *
 * @param val The value to be interpolated.
 * @param minA The minimum possible value of `val`.
 * @param maxA The maximum possible value of `val`.
 * @param minB The minimum possible value of the resulting number.
 * @param maxB The maximum possible value of the resulting number.
 * @returns An interpolated number between `minB` and `maxB`.
 *
 * @example
 * const originalValue = 235;
 * const newValue = interpolate(originalValue, 0, 255, 0, 1);
 * console.log(newValue); // 0.9215686274509803
 */
export const interpolate = (
	val: number,
	minA: number,
	maxA: number,
	minB: number,
	maxB: number,
): number => {
	return ((val - minA) * (maxB - minB)) / (maxA - minA) + minB;
};

/**
 * An object containing validation methods for the main transform methods and the CLI transform methods.
 *
 * The CLI transform requires additional validation (eg. checking if a file exists) on top of the main transform validations.
 */
export const validator = {
	/**
	 * Validates the width.
	 *
	 * @param width The number to validate.
	 * @returns True if the width is a positive integer.
	 *
	 * @private
	 * @example
	 * const valid1 = validator_validateWidth(-1);
	 * const valid2 = validator_validateWidth(0.5);
	 * const valid3 = validator_validateWidth(4);
	 * console.log(valid1, valid2, valid3); // false, false, true
	 */
	_validateWidth: (width: number): boolean =>
		!isNaN(width) && width >= 1 && !width.toString().includes("."),
	/**
	 * Validates the scale.
	 *
	 * @param width The number to validate.
	 * @returns True if the scale is a positive integer.
	 *
	 * @private
	 * @example
	 * const valid1 = validator_validateScale(-1);
	 * const valid2 = validator_validateScale(0.5);
	 * const valid3 = validator_validateScale(4);
	 * console.log(valid1, valid2, valid3); // false, false, true
	 */
	_validateScale: (scale: number): boolean =>
		!isNaN(scale) && scale >= 1 && !scale.toString().includes("."),
	/**
	 * Logs the error name and message to the console and shuts down the process.
	 *
	 * @param e The error.
	 *
	 * @private
	 */
	_handleError: (e: Error): void => {
		console.error(e.name + ": " + e.message);
		process.exit(0);
	},
	/**
	 * Runtime type checking for the CLI-specific options - further validations will be run when/if the encode method gets called
	 *
	 * **Validations:**
	 *
	 * - *binary*:
	 * 	- `has to contain only 1s and 0s, and must not be an empty string`
	 * - *file* and *overwrite*:
	 * 	- `must not exist on the filesystem if the overwrite option has not been specified`
	 * @param binary The text containing the bits
	 * @param file The image file that the encoded raw RGB data will be saved in
	 * @param overwrite Whether an existing file will be overwritten if it's name matched the file option
	 *
	 * @example
	 * const valid = validator.cliEncode("1111a", "/does/not/exist", false); // Prints out "Error: Specified binary string must be comprised of 0s and 1s." and then exits the process. The failed validations include: invalid binary string, file already exists.
	 */
	cliEncode: (
		binary: string,
		file: string,
		overwrite: boolean | undefined,
	): void => {
		try {
			if (!isBitString(binary))
				throw new Error(
					"Specified binary string must be comprised of 0s and 1s.",
				);
			if (!overwrite && fileExists(path.resolve(file)))
				throw new Error("Specified file already exists.");
		} catch (e) {
			validator._handleError(e);
		}
	},
	/**
	 * Runtime type checking for the CLI-specific options - further validations will be run when/if the decode method gets called
	 *
	 * **Validations:**
	 *
	 * - *file*:
	 * 	- `has to exist on the filesystem`
	 * @param file Path to the image containing the raw RGB data
	 *
	 * @example
	 * const valid = validator.cliDecode("/does/not/exist"); // Prints out "Error: Specified binary string must be comprised of 0s and 1s." and then exits the process. The failed validations include: nonexistent file.
	 */
	cliDecode: (file: string): void => {
		try {
			if (!fileExists(path.resolve(file)))
				throw new Error("Specified file doesn't exist.");
		} catch (e) {
			validator._handleError(e);
		}
	},
	/**
	 * Checks types at runtime - allows graceful error handling if end user ignores typescript type hints
	 *
	 * **Validations:**
	 *
	 * - *options.scale*:
	 * 	- `has to be a positive integer (if specified)`
	 * - *options.width*:
	 * 	- `has to be a positive integer (if specified)`
	 * 	- `has to be less than or equal to binary.length (if specified)`
	 * @param binary The text containing the bits
	 * @param options The encoding options
	 *
	 * @example
	 * const valid = validator.encode("1111a", {  scale: 0.5, inverted: false, width: -1 }); // Prints out "Error: Specified binary string must be comprised of 0s and 1s." and then exits the process. The failed validations include: invalid binary string, options.scale is not a positive integer, options.width is not a positive integer.
	 */
	encode: (binary: string, options?: EncodeOptions): void => {
		try {
			if (!isBitString(binary))
				throw new Error(
					"Specified binary string must be comprised of 0s and 1s.",
				);
			if (
				options !== undefined &&
				options.scale !== undefined &&
				!validator._validateScale(options.scale)
			)
				throw new RangeError("The scale option must be a positive integer.");
			if (
				options !== undefined &&
				options.width !== undefined &&
				!validator._validateWidth(options.width) &&
				options.width > binary.length
			)
				throw new RangeError(
					"The width option must be a positive integer less than or equal the length of the binary data.",
				);
		} catch (e) {
			validator._handleError(e);
		}
	},
	/**
	 * Checks types at runtime - allows graceful error handling if end user ignores typescript type hints
	 *
	 * **Validations:**
	 *
	 * - *options.scale*:
	 * 	- `has to be a positive integer (if specified)`
	 * - *options.width*:
	 * 	- `has to be a positive integer (if specified)`
	 * 	- `has to be less than or equal to values.length / 3 / (options.scale || 1) (if specified)`
	 * @param values The array containing the raw RGB values
	 * @param options The decoding options
	 *
	 * @example
	 * const valid = validator.decode(["a", -1], { inverted: false, scale: 0.5, width: -1 }); // Prints out "Error: The supplied values argument is not an array of raw RGB bytes." and then exits the process. The failed validations include: invalid raw RGB data, options.scale is not a positive integer, options.width is not a positive integer.
	 */
	decode: (values: number[], options?: DecodeOptions): void => {
		try {
			if (!isByteArray(values))
				throw new Error(
					"The supplied values argument is not an array of raw RGB bytes.",
				);
			if (
				options !== undefined &&
				options.scale !== undefined &&
				!validator._validateScale(options.scale)
			)
				throw new Error("The scale option must be a positive integer");
			if (
				options !== undefined &&
				options.width !== undefined &&
				!validator._validateWidth(options.width) &&
				options.width * (options.scale || 1) * 3 >
					values.map((n) => Math.round(interpolate(n, 0, 255, 0, 1)).toString())
						.length
			)
				throw new Error(
					"The width option must be a positive integer and less than values.length / 3 / (options.scale || 1)",
				);
		} catch (e) {
			validator._handleError(e);
		}
	},
};
