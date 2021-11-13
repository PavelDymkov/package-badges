import { npmPackagr } from "npm-packagr";
import {
    assets,
    build,
    doIf,
    git,
    packageJSON,
    version,
} from "npm-packagr/pipelines";

npmPackagr({
    pipelines: [
        doIf({
            env: "publish",
            pipelines: [
                git("check-status"),

                build(({ exec }) => {
                    exec("tsc");
                }),

                version("patch"),

                git("push"),
            ],
        }),

        packageJSON((packageJson) => {
            delete packageJson.scripts;
            delete packageJson.devDependencies;

            packageJson.main = "index.js";
            packageJson.bin = {
                packagr: "./cli.js",
            };
            packageJson.types = ".";
        }),

        assets("LICENSE", "README.md", "schema.json", "src/cli.js"),

        doIf({
            env: "dev",
            pipeline: build(({ exec }) => {
                exec("tsc --watch");
            }),
        }),
    ],
});
