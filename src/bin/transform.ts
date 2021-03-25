import fs from "fs";
import { fileExists } from "./../utils";
import sharp from "sharp";
import { DecodeOptions, encode, decode } from "./../main";

interface CliEncodeOptions {
	width: number;
	inverted?: boolean;
	scale?: number;
	overwrite?: boolean;
}

interface CliDecodeOptions {
	scale: number;
	inverted?: boolean;
}

export const encodeImage = (
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
export const decodeImage = (path: string, options: CliDecodeOptions): void => {
	const decodeOptions: DecodeOptions = {
		width: 0,
		scale: options.scale,
		inverted: options.inverted,
	};
	const image = sharp(path);
	image.metadata().then((metadata) => {
		// The image width will always be divisible by options.scale (provided the scale was correct), because the scale was used during the creation of the image to multiply the width
		decodeOptions.width = (metadata.width as number) / options.scale;
		image
			.raw()
			.toBuffer()
			.then((data) => {
				console.log(decode(new Array(...data), decodeOptions));
			});
	});
};
