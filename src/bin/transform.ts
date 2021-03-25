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
	const scale = options.scale as number;
	const imageData = Uint8Array.from(values);
	if (options.overwrite && fileExists(path)) {
		fs.unlinkSync(path);
	}
	const image = sharp(imageData, {
		raw: {
			width: options.width,
			height: Math.ceil(values.length / options.width),
			channels: 1,
		},
	});
	image.metadata().then((metadata) => {
		image
			.resize({
				width: (metadata.width as number) * scale,
				height: (metadata.height as number) * scale,
				fit: "contain",
				kernel: "nearest",
			})
			.jpeg({
				quality: 100,
			})
			.toFile(path);
	});
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
		const width = (metadata.width as number) / options.scale;
		decodeOptions.width = width;
		image
			.raw()
			.toBuffer()
			.then((data) => {
				console.log(decode(new Array(...data), decodeOptions));
			});
	});
};
