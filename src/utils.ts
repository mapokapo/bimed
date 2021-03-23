export const stringChunks = (str: string, chunkSize: number): string[] => {
	const numChunks = Math.ceil(str.length / chunkSize);
	const chunks: string[] = new Array<string>(numChunks);

	for (let i = 0, o = 0; i < numChunks; ++i, o += chunkSize) {
		chunks[i] = str.substr(o, chunkSize);
	}

	return chunks;
};
