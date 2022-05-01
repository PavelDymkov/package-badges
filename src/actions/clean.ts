import { writeFileSync as write } from "fs";
import { join } from "path";
import { config, rm, test } from "shelljs";

import { getConfig } from "../tools/config";
import { parse } from "../tools/parse-readme";

config.silent = true;

export interface CleanOptions {
    config?: string;
}

export function clean(options?: CleanOptions): void {
    const { outDir, readme } = getConfig(options?.config);

    if (test("-f", readme)) cleanReadme(readme);

    deleteBadges(outDir);
}

function cleanReadme(path: string): void {
    const { header, content } = parse(path);

    const file = content ? header + content : header.trimEnd() + "\n";

    write(path, file);
}

function deleteBadges(outDir: string): void {
    const badgesPath = join(outDir, "*.svg");
    const origin = config.silent;

    config.silent = true;

    rm(badgesPath);

    config.silent = origin;
}
