import { makeBadge } from "badge-maker";
import { readFileSync as read, writeFileSync as write } from "fs";
import { not } from "logical-not";
import { join } from "path";
import { exec, mkdir, test } from "shelljs";

import { getConfig } from "../config";

interface CreateOptions {
    fileName: string;
    baseUrl?: string;
    config?: string;
    label?: string;
    labelColor?: string;
    message: string;
    messageColor?: string;
}

export function create({
    fileName,
    baseUrl,
    config,
    label = "",
    labelColor = "",
    message,
    messageColor = "",
}: CreateOptions): void {
    const { outDir, readme } = getConfig(config);

    if (not(/\.svg$/.test(fileName))) fileName += ".svg";

    const filePath = join(outDir, fileName);
    const svg = makeBadge({
        label,
        labelColor,
        message,
        color: messageColor,
    });

    if (not(test("-d", outDir))) mkdir("-p", outDir);

    write(filePath, svg + "\n");

    addToReadMe: {
        const target = getTarget(fileName, outDir, baseUrl);

        const altText = label ? `${label}: ${message}` : message;
        const line = `![${altText}](${target})\n`;

        const source = read(readme).toString();
        const [block, header] =
            source.match(/^([#][^#\n]+\n{2})?(\!\[.+?\]\(.+?\.svg\)\n)*/) || [];

        if (block) {
            const prefix = source.slice(0, block.length);
            const suffix = source.slice(block.length);

            const extraNewLine = block === header ? "\n" : "";

            write(readme, `${prefix}${line}${extraNewLine}${suffix}`);
        } else {
            write(readme, `${line}\n${source}`);
        }
    }
}

function getTarget(fileName: string, outDir: string, baseUrl?: string): string {
    if (baseUrl) {
        if (not(baseUrl.endsWith("/"))) baseUrl += "/";

        return baseUrl + fileName;
    }

    const origin = exec("git config --get remote.origin.url", { silent: true })
        .stdout.trim()
        .replace(/^(https:\/\/github.com\/|git@github.com:)/, "")
        .replace(/\.git$/, "");

    return `https://raw.githubusercontent.com/${origin}/master/${outDir}/${fileName}`;
}
