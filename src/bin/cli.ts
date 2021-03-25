#!/usr/bin/env node
import yargs from "yargs/yargs";
import path from "path";
import { fileExists, isBinary } from "./../utils";
import { encodeImage, decodeImage } from "./transform";

yargs(process.argv.slice(2))
	.command({
		command: "encode <binary> <file> [options...]",
		describe:
			"Encode the given binary string into an image with the given name",
		builder: (y) => {
			return y
				.positional("binary", {
					type: "string",
					describe: "Binary text in form of 1s and 0s",
				})
				.positional("file", {
					type: "string",
					describe:
						"Name of the resulting image file (including the file extension)",
				})
				.options("w", {
					alias: "width",
					type: "number",
					describe: "Width of a single row of the binary data",
					demandOption: true,
				})
				.option("s", {
					alias: "scale",
					type: "number",
					describe:
						"By how much to multiply the width and height of the resulting image",
					default: 1,
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
				.check(({ binary, file, w, s, o }) => {
					if (binary && !isBinary(binary as string))
						throw new Error(
							"Specified binary text must be comprised of 1s and 0s",
						);
					if (!o && fileExists(path.resolve(file as string)))
						throw new Error("Specified file already exists");
					if (w && (w < 1 || isNaN(w) || w.toString().includes(".")))
						throw new TypeError("Width option must be a positive integer");
					if (s && (s < 1 || isNaN(s) || s.toString().includes(".")))
						throw new RangeError("Scale option must be a positive integer");
					return true;
				})
				.strict();
		},
		handler: (argv) => {
			encodeImage(argv.binary as string, path.resolve(argv.file as string), {
				width: argv.w as number,
				inverted: argv.inverted as boolean,
				scale: argv.scale as number,
				overwrite: argv.o as boolean,
			});
		},
	})
	.command({
		command: "decode <file> [options...]",
		describe: "Decode the given image to binary text",
		builder: (y) => {
			return y
				.positional("file", {
					type: "string",
					describe:
						"Name of the image file that contains binary data to decode (including the file extension)",
				})
				.option("s", {
					alias: "scale",
					type: "number",
					describe:
						"By how much to multiply the width and height of the resulting image",
					default: 1,
				})
				.option("i", {
					alias: "inverted",
					type: "boolean",
					describe:
						"Whether the white/black pixels should be treated as 0s and 1s respectively instead",
					boolean: true,
					default: false,
				})
				.check(({ file, s }) => {
					if (!fileExists(path.resolve(file as string)))
						throw new Error("Specified file doesn't exist");
					if (s && (s < 1 || isNaN(s) || s.toString().includes(".")))
						throw new RangeError("Scale option must be a positive integer");
					return true;
				})
				.strict();
		},
		handler: (argv) => {
			decodeImage(path.resolve(argv.file as string), {
				scale: argv.scale as number,
				inverted: argv.inverted as boolean,
			});
		},
	})
	.alias("v", "version")
	.alias("h", "help")
	.demandCommand()
	.strict()
	.help().argv;
