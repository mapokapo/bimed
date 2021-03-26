#!/usr/bin/env node
import yargs from "yargs/yargs";
import path from "path";
import { validator } from "../utils";
import { cliDecode, cliEncode } from "./cliTransform";

yargs(process.argv.slice(2))
	.command({
		command: "encode <binary> <file> [options...]",
		describe:
			"Encode the given binary string into an image with the given name",
		builder: (y) => {
			return y
				.positional("b", {
					alias: "binary",
					type: "string",
					describe: "Binary text in form of 1s and 0s",
					demandOption: true,
				})
				.positional("f", {
					alias: "file",
					type: "string",
					describe:
						"Name of the resulting image file (including the file extension)",
					demandOption: true,
				})
				.option("i", {
					alias: "inverted",
					type: "boolean",
					describe:
						"Whether 0s and 1s should be turned into white and black pixels respectively instead",
					boolean: true,
				})
				.option("o", {
					alias: "overwrite",
					type: "boolean",
					describe:
						"Whether an existing file should be overwritten if it has the same name as the supplied file name",
					boolean: true,
				})
				.option("s", {
					alias: "scale",
					type: "number",
					describe:
						"By how much to multiply the width and height of the resulting image",
				})
				.options("w", {
					alias: "width",
					type: "number",
					describe: "Width of a single row of the binary data",
					demandOption: true,
				})
				.check(({ b, f, o }) => {
					validator.cliEncode(b, f, o);
					return true;
				})
				.strict();
		},
		handler: (argv) => {
			cliEncode(argv.binary as string, path.resolve(argv.file as string), {
				inverted: argv.i ? (argv.i as boolean) : false,
				overwrite: argv.o ? (argv.o as boolean) : false,
				scale: argv.s ? (argv.s as number) : 1,
				width: argv.w ? (argv.w as number) : 1,
			});
		},
	})
	.command({
		command: "decode <file> [options...]",
		describe: "Decode the given image to binary text",
		builder: (y) => {
			return y
				.positional("f", {
					alias: "file",
					type: "string",
					describe:
						"Name of the image file that contains raw RGB data to decode (including the file extension)",
					demandOption: true,
				})
				.option("i", {
					alias: "inverted",
					type: "boolean",
					describe:
						"Whether the white/black pixels should be treated as 0s and 1s respectively instead",
					boolean: true,
				})
				.option("s", {
					alias: "scale",
					type: "number",
					describe:
						"By how much to multiply the width and height of the resulting image",
				})
				.check(({ f }) => {
					validator.cliDecode(f);
					return true;
				})
				.strict();
		},
		handler: (argv) => {
			cliDecode(path.resolve(argv.file as string), {
				inverted: argv.i ? (argv.i as boolean) : false,
				scale: argv.s ? (argv.s as number) : 1,
			});
		},
	})
	.demandCommand()
	.alias("h", "help")
	.alias("v", "version")
	.strict()
	.help().argv;
