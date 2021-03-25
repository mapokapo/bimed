import fs from "fs";
import { DecodeOptions, EncodeOptions } from "./main";

export const arrayChunks = <T>(arr: T[], chunkSize: number): T[][] => {
	const chunks = [];
	const n = arr.length;

	let i = 0;
	while (i < n) {
		chunks.push(arr.slice(i, (i += chunkSize)));
	}

	return chunks;
};

export const fileExists = (path: string): boolean => {
	return fs.existsSync(path);
};

export const isBinary = (str: string): boolean => {
	return str.split("").every((char) => char === "0" || char === "1");
};

export const scale = (
	val: number,
	minA: number,
	maxA: number,
	minB: number,
	maxB: number,
): number => {
	return ((val - minA) * (maxB - minB)) / (maxA - minA) + minB;
};

export const validateOptions = {
	_validateWidth: (width: number): boolean =>
		width !== undefined &&
		!isNaN(width) &&
		width >= 1 &&
		!width.toString().includes("."),
	_validateScale: (scale: number | undefined): boolean =>
		scale !== undefined &&
		!isNaN(scale) &&
		scale >= 1 &&
		!scale.toString().includes("."),
	_handleError: (e: Error): void => {
		console.error(e.name + ": " + e.message);
		process.exit(0);
	},
	encode: (binary: string, options: EncodeOptions): void => {
		try {
			if (
				!validateOptions._validateWidth(options.width) ||
				options.width > binary.length
			)
				throw new RangeError(
					"EncodeOptions.width must be a positive integer > 0 and < binary.length",
				);
		} catch (e) {
			validateOptions._handleError(e);
		}
	},
	decode: (values: number[], options: DecodeOptions): void => {
		try {
			if (!validateOptions._validateScale(options.scale))
				throw new RangeError("DecodeOptions.scale must be a positive integer");
			if (
				options.width % (options.scale as number) !== 0 ||
				(options.scale as number) > options.width
			)
				throw new Error(
					"DecodeOptions.width must be less than, and be divisible by DecodeOptions.scale",
				);
			if (
				!validateOptions._validateWidth(options.width) ||
				options.width * (options.scale as number) * 3 >
					values.map((n) => Math.round(scale(n, 0, 255, 0, 1)).toString())
						.length
			)
				throw new Error(
					"DecodeOptions.width must be a positive integer < width of a single row of bits",
				);
		} catch (e) {
			validateOptions._handleError(e);
		}
	},
};
