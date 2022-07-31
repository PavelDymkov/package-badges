import { makeBadge } from "badge-maker";
import { writeFileSync as write } from "fs";
import { not } from "logical-not";
import { join } from "path";
import { exec as sh, mkdir, test } from "shelljs";

import { getConfig } from "../tools/config";
import { parse } from "../tools/parse-readme";

export interface CreateOptions {
    label?: string;
    labelColor?: string;
    message: string;
    messageColor?: string;
    href?: string;
    config?: string;
}

export function create(fileName: string, options: CreateOptions): void {
    const {
        config,
        label = "",
        labelColor = "",
        message,
        messageColor = "",
        href: link = "",
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
        const { header, badges, content } = parse(readme);

        const href = getBadgeHref(fileName, outDir, baseUrl);

        if (not(href)) return;

        const altText = label ? `${label}: ${message}` : message;

        const file = [header, addTo(badges, href, altText, link)];

        if (content) file.push("\n\n", content);
        else file.push("\n");

        write(readme, file.join(""));
    }
}

function getBadgeHref(
    fileName: string,
    outDir: string,
    baseUrl?: string,
): string | null {
    if (baseUrl) {
        if (not(baseUrl.endsWith("/"))) baseUrl += "/";

        return baseUrl + fileName;
    }

    const isInsideWorkTreeCode =
        sh("git rev-parse --is-inside-work-tree", {
            silent: true,
        }).code === 0;

    if (not(isInsideWorkTreeCode)) return null;

    const origin = exec("git config --get remote.origin.url")
        .replace(/^(https:\/\/github.com\/|git@github.com:)/, "")
        .replace(/\.git$/, "");

    const branch = exec("git rev-parse --abbrev-ref HEAD");

    return `https://raw.githubusercontent.com/${origin}/${branch}/${outDir}/${fileName}`;
}

function exec(command: string): string {
    return sh(command, { silent: true }).stdout.trim();
}

function addTo(
    badges: string,
    href: string,
    altText: string,
    link: string,
): string {
    let badge = `![${altText}](${href})`;

    if (link) badge = `[${badge}](${link})`;

    const items = badges ? badges.match(/\!\[.+?\]\(.+?\.svg\)/g)! : [];

    const i = items.findIndex(
        (item) => item.includes(href) || item.includes(altText),
    );

    if (i === -1) items.push(badge);
    else items[i] = badge;

    return items.join("\n");
}
