import { parse } from "css-tree";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { getAllClassNames } from "../src/utils";

describe("utils", () => {
	it("get class names", async () => {
		const filePath = createRequire(import.meta.url).resolve(
			"daisyui/daisyui.css",
		);

		const names = getAllClassNames(
			parse(await readFile(filePath, "utf-8")),
		).toSorted();
		expect(names).matchSnapshot();
	});
});
