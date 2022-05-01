import { npmPackagr } from "npm-packagr";
import {
    assets,
    badge,
    BadgeType,
    doIf,
    git,
    npx,
    packageJSON,
    publish,
    test,
    version,
} from "npm-packagr/pipelines";

npmPackagr({
    pipelines: [
        doIf("build", [
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

        doIf("build", [
            badge(BadgeType.License),
            badge(BadgeType.TSDeclarations),
            badge("fun", {
                label: "Make",
                labelColor: "aqua",
                message: "Badges",
                messageColor: "fuchsia",
            }),

            assets("LICENSE", "README.md", "schema.json", "src/bin.js"),

            git("commit", "package-badges"),
            git("push"),

            publish({
                login: { account: "paveldymkov", email: "dymkov86@gmail.com" },
            }),
        ]),

        doIf("dev", [assets("src/bin.js"), npx("tsc --watch")]),
    ],
});
