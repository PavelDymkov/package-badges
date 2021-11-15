import { npmPackagr } from "npm-packagr";
import {
    assets,
    badge,
    BadgeType,
    doIf,
    git,
    packageJSON,
    version,
} from "npm-packagr/pipelines";

npmPackagr({
    pipelines: [
        doIf("build", [
            git("check-status"),

            ({ exec }) => exec("tsc"),

            version("patch"),
        ]),

        packageJSON((packageJson) => {
            delete packageJson.scripts;
            delete packageJson.devDependencies;

            packageJson.main = "index.js";
            packageJson.bin = {
                packagr: "./bin.js",
            };
            packageJson.types = ".";
        }),

        doIf("build", [
            badge(BadgeType.Build),
            badge(BadgeType.License),
            badge("fun", {
                label: "Make",
                labelColor: "aqua",
                message: "Badges",
                messageColor: "fuchsia",
            }),

            git("commit", "package-badges"),
            git("push"),
        ]),

        assets("LICENSE", "README.md", "schema.json", "src/bin.js"),

        doIf("dev", [
            ({ exec }) => {
                exec("tsc --watch");
            },
        ]),
    ],
});
