import { readFileSync as read } from "fs";
import { not } from "logical-not";
import { test } from "shelljs";

export interface Config {
    outDir: string;
    readme: string;
    baseUrl: string;
}

export function getConfig(path?: string): Config {
    const source = getSource(path);
    const config: Config = {
        outDir: toString(source.outDir, "badges"),
        readme: toString(source.readme, "README.md"),
        baseUrl: toString(source.baseUrl, ""),
    };

    return config;
}

function getSource(path?: string): any {
    if (not(path)) path = ".badges.json";
    if (not(test("-f", path))) return {};

    try {
        return JSON.parse(read(path).toString());
    } catch (_) {
        return {};
    }
}

function toString(source: any, defaultValue: string): string {
    return typeof source === "string" ? source : defaultValue;
}
