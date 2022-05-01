import { readFileSync as read } from "fs";

export interface ReadMe {
    header: string;
    badges: string;
    content: string;
}

export function parse(path: string): ReadMe {
    const readme = read(path).toString();

    const header = match(readme, /^\s*#(?!#).*?\n\s*/);
    const rest = header ? readme.slice(header.length) : readme;
    const badges = match(rest, /\s*(\!\[.+?\]\(.+?\.svg\)\s+)+/);

    return {
        header: format(header, "\n\n"),
        badges: format(badges),
        content: format(badges ? rest.slice(badges.length) : rest, "\n"),
    };
}

function match(source: string, pattern: RegExp): string {
    return source.match(pattern)?.[0] || "";
}

function format(source: string, suffix = ""): string {
    source = source.trim();

    return source ? source + suffix : "";
}
