import { join } from "path";
import { exec, exit, rm, test } from "shelljs";

if (process.cwd() !== join(__dirname, "..")) exit(1);

const { outDir } = require("../tsconfig.json").compilerOptions;

if (test("-d", outDir)) rm("-rf", outDir);

exec("npx tsc");
