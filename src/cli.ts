import { Command } from "commander";

const program = new Command();

program.version(require("./package.json").version);

program
    .command("clean")
    .description("Clear badges directory and README.md")
    .option("-C, --config [path]", "Path to config")
    .action((options) => require("./actions/clean").clean(options));

program
    .command("create")
    .description("Create a badge")
    .option("-F, --file-name <value>", "Badge file name")
    .option("-C, --config [path]", "Path to config")
    .option("-L, --label [text]", "Badge label")
    .option("-LC, --label-color [value]", "Label color")
    .option("-M, --message <text>", "Badge message")
    .option("-MC, --message-color [value]", "Message color")
    .option("-H, --href [value]", "Create a badge as a link")
    .action((options) =>
        require("./actions/create").create(options.fileName, options),
    );

program.parse(process.argv);
