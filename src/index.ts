import { stringChunks } from "./utils";

interface EncodeOptions {
	width: number;
	inverted?: boolean;
	scale?: number;
}

interface DecodeOptions {
	inverted?: boolean;
	scale?: number;
}

export const encode = (binary: string, options: EncodeOptions): string[] => {
	if (options.width < 1 || options.width > binary.length)
		throw new RangeError("EncodeOptions.width must be > 0 and < binary.length");
	let rows = stringChunks(binary, options.width);

	if (options.inverted)
		rows = rows
			.join("")
			.split("")
			.map((n) => Number(!Number(n)).toString());

	return rows;
};

export const decode = (rows: string[], options?: DecodeOptions): string => {
	let result = rows.join("");
	if (options?.inverted)
		result = result
			.split("")
			.map((n) => Number(!Number(n)).toString())
			.join("");

	return result;
};
