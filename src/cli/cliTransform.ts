import fs from "fs";
import { fileExists } from "../utils";
import sharp from "sharp";
import { encode, decode } from "../transform";

/**
 * The CLI-specific encoding options.
 */
interface CliEncodeOptions {
	/**
	 * Whether the input bits should be inverted (1 becomes 0, 0 becomes 1).
	 *
	 * @default false
	 */
	inverted: boolean;
	/**
	 * Whether a file should be overwritten if it has the same name as the input file name.
	 *
	 * @default false
	 */
	overwrite: boolean;
	/**
	 * By how much to scale up the resulting raw RGB data. This multiplies every value as well as every row of the data.
	 *
	 * eg. if scale is 2, that means there will be twice as many rows, and twice as many bytes in each row.
	 *
	 * @default 1
	 */
	scale: number;
	/**
	 * How many bits are needed to fill up a single row with raw RGB data.
	 *
	 * eg. if width is 4, that means the raw RGB data for a single row of pixels with a scale of 1 will have 12 bytes.
	 *
	 * @default 1
	 */
	width: number;
}

/**
 * The CLI-specific decoding options.
 */
interface CliDecodeOptions {
	/**
	 * Whether the input bytes should be inverted (0-127 becomes 1, 128-256 becomes 0).
	 *
	 * @default false
	 */
	inverted: boolean;
	/**
	 * By how much to scale down the input raw RGB data. This keeps every nth row as well as every nth byte in each row, where n = scale, and discards the rest.
	 *
	 * eg. if scale is 2, that means there will be half as as many rows, and half as many bytes in each row. If the input bytes have also been scaled up by 2, this means the resulting bits will be properly scaled and there won't be any duplicated.
	 *
	 * @default 1
	 */
	scale: number;
}

/**
 * Encodes a string containing bits to an array of raw RGB values, then writes those values to a file with a path of `path`.
 *
 * @deprecated Do not call this method directly. This is only for use with the CLI.
 *
 * @param data The string containing the bits.
 * @param path The path of the file which will contain the resulting raw RGB data.
 * @param options The CLI-specific encoding options.
 */
export const cliEncode = (
	data: string,
	path: string,
	options: CliEncodeOptions,
): void => {
	const values = encode(data, options);
	if (options.overwrite && fileExists(path)) {
		fs.unlinkSync(path);
	}
	sharp(Uint8Array.from(values), {
		raw: {
			width: options.width * (options.scale as number),
			height: Math.ceil(
				values.length / 3 / (options.scale as number) / options.width,
			),
			channels: 3,
		},
	})
		.jpeg({
			quality: 100,
		})
		.toFile(path);
};

/**
 * Encodes a string containing bits to an array of raw RGB values, then writes those values to a file with a path of `path`.
 *
 * @deprecated Do not call this method directly. This is only for use with the CLI.
 *
 * @param data The string containing the bits.
 * @param path The path of the file which will contain the resulting raw RGB data.
 * @param options The CLI-specific encoding options.
 */
/**
 * Decodes an array which contains raw RGB values that was gathered from an image with a path of `path` to a string containing bits which represent black and white pixels.
 *
 * @deprecated Do not call this method directly. This is only for use with the CLI.
 *
 * @param path The path of the file which contains the raw RGB data.
 * @param options The CLI-specific decoding options.
 */
export const cliDecode = (path: string, options: CliDecodeOptions): void => {
	const image = sharp(path);
	image.metadata().then((metadata) => {
		image
			.raw()
			.toBuffer()
			.then((data) => {
				console.log(
					decode(new Array(...data), {
						...options,
						// The image width will always be divisible by options.scale (provided the scale was correct), because the scale was used during the creation of the image to multiply the width
						width: (metadata.width as number) / options.scale,
					}),
				);
			});
	});
};
