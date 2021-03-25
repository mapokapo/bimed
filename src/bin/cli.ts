#!/usr/bin/env node
import yargs from "yargs/yargs";
import path from "path";
import { fileExists, isBinary, validateOptions } from "./../utils";
import { encodeImage, decodeImage } from "./transform";

yargs(process.argv.slice(2))
	.command({
		command: "encode <binary> <file> [options...]",
		describe:
			"Encode the given binary string into an image with the given name",
		builder: (y) => {
			return y
				.positional("binary", {
					alias: "b",
					type: "string",
					describe: "Binary text in form of 1s and 0s",
				})
				.positional("file", {
					alias: "f",
					type: "string",
					describe:
						"Name of the resulting image file (including the file extension)",
				})
				.option("i", {
					alias: "inverted",
					type: "boolean",
					describe:
						"Whether 0s and 1s should be turned into white and black pixels respectively instead",
					boolean: true,
					default: false,
				})
				.option("o", {
					alias: "overwrite",
					type: "boolean",
					describe:
						"Whether an existing file should be overwritten if it has the same name as the supplied file name",
					boolean: true,
					default: false,
				})
				.option("s", {
					alias: "scale",
					type: "number",
					describe:
						"By how much to multiply the width and height of the resulting image",
					default: 1,
				})
				.options("w", {
					alias: "width",
					type: "number",
					describe: "Width of a single row of the binary data",
					demandOption: true,
				})
				.check(({ b, f, o, s, w }) => {
					try {
						if (b && !isBinary(b as string))
							throw new Error(
								"Specified binary text must be comprised of 1s and 0s",
							);
						if (!o && fileExists(path.resolve(f as string)))
							throw new Error("Specified file already exists");
						if (!validateOptions._validateScale(s))
							throw new RangeError("Scale option must be a positive integer");
						if (!validateOptions._validateScale(w))
							throw new TypeError("Width option must be a positive integer");
					} catch (e) {
						validateOptions._handleError(e);
					}
					return true;
				})
				.strict();
		},
		handler: (argv) => {
			encodeImage(argv.binary as string, path.resolve(argv.file as string), {
				inverted: argv.inverted as boolean,
				overwrite: argv.o as boolean,
				scale: argv.scale as number,
				width: argv.w as number,
			});
		},
	})
	.command({
		command: "decode <file> [options...]",
		describe: "Decode the given image to binary text",
		builder: (y) => {
			return y
				.positional("file", {
					alias: "f",
					type: "string",
					describe:
						"Name of the image file that contains binary data to decode (including the file extension)",
				})
				.option("i", {
					alias: "inverted",
					type: "boolean",
					describe:
						"Whether the white/black pixels should be treated as 0s and 1s respectively instead",
					boolean: true,
					default: false,
				})
				.option("s", {
					alias: "scale",
					type: "number",
					describe:
						"By how much to multiply the width and height of the resulting image",
					default: 1,
				})
				.check(({ f, s }) => {
					try {
						if (!fileExists(path.resolve(f as string)))
							throw new Error("Specified file doesn't exist");
						if (!validateOptions._validateScale(s))
							throw new RangeError("Scale option must be a positive integer");
					} catch (e) {
						validateOptions._handleError(e);
					}
					return true;
				})
				.strict();
		},
		handler: (argv) => {
			decodeImage(path.resolve(argv.file as string), {
				inverted: argv.inverted as boolean,
				scale: argv.scale as number,
			});
		},
	})
	.demandCommand()
	.alias("h", "help")
	.alias("v", "version")
	.strict()
	.help().argv;
