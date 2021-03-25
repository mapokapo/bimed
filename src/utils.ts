import fs from "fs";
import { DecodeOptions, EncodeOptions } from "./main";

export const stringChunks = (str: string, chunkSize: number): string[] => {
	const numChunks = Math.ceil(str.length / chunkSize);
	const chunks: string[] = new Array<string>(numChunks);

	for (let i = 0, o = 0; i < numChunks; ++i, o += chunkSize) {
		chunks[i] = str.substr(o, chunkSize);
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
	encode: (binary: string, options: EncodeOptions): Error | null => {
		if (
			options.width < 1 ||
			options.width.toString().includes(".") ||
			options.width > binary.length
		)
			return new RangeError(
				"EncodeOptions.width must be a positive integer > 0 and < binary.length",
			);
		if (options.scale !== undefined)
			if (options.scale < 1 || options.scale.toString().includes("."))
				return new RangeError("EncodeOptions.scale must be a positive integer");
		return null;
	},
	decode: (values: number[], options: DecodeOptions): Error | null => {
		if (options.scale < 1 || options.scale.toString().includes("."))
			return new RangeError("DecodeOptions.scale must be a positive integer");
		if (options.width % options.scale !== 0 || options.scale > options.width)
			return new Error(
				"DecodeOptions.width must be less than, and be divisible by DecodeOptions.scale",
			);
		if (
			options.width < 1 ||
			options.width.toString().includes(".") ||
			options.width * options.scale * 3 >
				values.map((n) => Math.round(scale(n, 0, 255, 0, 1)).toString()).length
		)
			return new Error(
				"DecodeOptions.width must be a positive integer < width of a single row of bits",
			);
		return null;
	},
};
