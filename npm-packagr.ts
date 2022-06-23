import { writeFileSync as write } from "fs";
import { npmPackagr } from "npm-packagr";
import {
    assets,
    badge,
    BadgeType,
    doIf,
    git,
    npx,
    packageJSON,
    PipeContext,
    publish,
    test,
    version,
} from "npm-packagr/pipes";

npmPackagr({
    pipeline: [
        doIf("publish", [
            git("commit", "package-badges"),

            npx("tsc"),
            badge(BadgeType.Build),
            test(),
            badge(BadgeType.Test),

            version("patch", {
                commitHooks: false,
                gitTagVersion: false,
            }),
            version("patch", {
                commitHooks: false,
                gitTagVersion: false,
            }),
        ]),

        packageJSON((packageJson) => {
            delete packageJson.scripts;
            delete packageJson.devDependencies;

            packageJson.main = "index.js";
            packageJson.bin = {
                badges: "./bin.js",
            };
            packageJson.types = ".";
        }),

        doIf("publish", [
            badge(BadgeType.License),
            badge(BadgeType.TSDeclarations),
            badge("fun", {
                label: "Make",
                labelColor: "aqua",
                message: "Badges",
                messageColor: "fuchsia",
            }),

            assets("LICENSE", "README.md", "src/schema.json"),

            createBinJs,

            git("commit", "package-badges"),
            git("push"),

            publish({
                login: { account: "paveldymkov", email: "dymkov86@gmail.com" },
            }),
        ]),

        doIf("dev", [createBinJs, npx("tsc --watch")]),
    ],
});

function createBinJs({ packageDirectory, path }: PipeContext): void {
    const file = getBinJs();

    write(path`${packageDirectory}/bin.js`, file);
}

function getBinJs(): string {
    const file = `
        #!/usr/bin/env node

        require("./cli");
    `;

    return file.trimStart().replace(/(?: )+/g, "");
}
