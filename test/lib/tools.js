const { ok } = require("assert");
const { readFileSync: read } = require("fs");
const { join } = require("path");
const { ShellString, mkdir, rm, test } = require("shelljs");

const { badges, temp } = require("./constants");

exports.prepareTest = prepareTest;
exports.readme = readme;
exports.readmeIs = readmeIs;
exports.badge = badge;

function prepareTest() {
    if (test("-d", temp)) rm("-rf", temp);

    mkdir(temp);
}

function readme(content) {
    content =
        content
            .trim()
            .split(/\n/)
            .map((line) => line.trim())
            .join("\n") + "\n";

    ShellString(content).to(join(temp, "readme.md"));
}

function readmeIs(...expected) {
    const actual = read(join(temp, "readme.md"), { encoding: "utf-8" });

    ok(actual === expected.join(""));
}

function badge(name, altText) {
    const badge = join(badges, name + ".svg");
    const branch = "main";

    ok(test("-f", badge));

    return `![${altText}](https://raw.githubusercontent.com/PavelDymkov/package-badges/${branch}/${badge})\n`;
}
