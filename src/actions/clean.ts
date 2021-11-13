import { readFileSync as read, writeFileSync as write } from "fs";
import { join } from "path";
import { rm, test } from "shelljs";

import { getConfig } from "../tools/config";

export interface CleanOptions {
    config?: string;
}

export function clean(options: CleanOptions): void {
    const { outDir, readme } = getConfig(options.config);

    const badgesPath = join(outDir, "*.svg");

    if (test("-f", badgesPath)) rm(badgesPath);
    if (test("-f", readme)) cleanReadme(readme);
}

function cleanReadme(path: string): void {
    const readme = read(path)
        .toString()
        .replace(/(\n\!\[.+?\]\(.+?\.svg\))+\n/, "");

    write(path, readme);
}
