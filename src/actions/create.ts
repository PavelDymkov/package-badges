import { makeBadge } from "badge-maker";
import { writeFileSync as write } from "fs";
import { not } from "logical-not";
import { join } from "path";
import { exec, mkdir, test } from "shelljs";

import { getConfig } from "../tools/config";
import { parse } from "../tools/parse-readme";

export interface CreateOptions {
    label?: string;
    labelColor?: string;
    message: string;
    messageColor?: string;
    config?: string;
}

export function create(fileName: string, options: CreateOptions): void {
    const {
        config,
        label = "",
        labelColor = "",
        message,
        messageColor = "",
    } = options;

    const { baseUrl, outDir, readme } = getConfig(config);

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
        debugger;
        const { header, badges, content } = parse(readme);

        const href = getBadgeHref(fileName, outDir, baseUrl);
        const altText = label ? `${label}: ${message}` : message;

        const file = [header, addTo(badges, href, altText)];

        if (content) file.push("\n\n", content);
        else file.push("\n");

        write(readme, file.join(""));
    }
}

function getBadgeHref(
    fileName: string,
    outDir: string,
    baseUrl?: string,
): string {
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

function addTo(badges: string, href: string, altText: string): string {
    href = `(${href})`;
    altText = `[${altText}]`;

    const badge = `!${altText}${href}`;
    const items = badges ? badges.match(/\!\[.+?\]\(.+?\.svg\)/g)! : [];

    const i = items.findIndex(
        (item) => item.includes(href) || item.includes(altText),
    );

    if (i === -1) items.push(badge);
    else items[i] = badge;

    return items.join("\n");
}
