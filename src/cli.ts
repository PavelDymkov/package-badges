import { Command } from "commander";

const program = new Command();

program.version(require("../package.json").version);

program
    .command("clean")
    .description("Clear badges directory and README.md")
    .option("-C, --config [path]", "Path to config")
    .action((options) => require("./cli-actions/clean").clean(options));

program
    .command("create")
    .description("Create a badge")
    .option("-B, --base-url <href>", "Path to serve directory")
    .option("-F, --file-name <value>", "Badge file name")
    .option("-C, --config [path]", "Path to config")
    .option("-L, --label [text]", "Badge label")
    .option("-LC, --label-color [value]", "Label color")
    .option("-M, --message <text>", "Badge message")
    .option("-MC, --message-color [value]", "Message color")
    .action((options) => require("./cli-actions/create").create(options));

program.parse(process.argv);
