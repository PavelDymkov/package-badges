import { exec } from "shelljs";

export function clean(): void {
    exec("badges clean");
}

export function createBadge(): void {
    // .option("-T, --target <path>", "Path to serve directory")
    // .option("-F, --file-name <value>", "Badge file name")
    // .option("-C, --config [path]", "Path to config")
    // .option("-L, --label [text]", "Badge label")
    // .option("-LC, --label-color [value]", "Label color")
    // .option("-M, --message <text>", "Badge message")
    // .option("-MC, --message-color [value]", "Message color")
}
