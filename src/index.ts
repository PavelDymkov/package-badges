import { exec } from "shelljs";

export function clean(): void {
    exec("badges clean");
}

export interface BadgeOptions {
    label?: string;
    labelColor?: string;
    message: string;
    messageColor?: string;
}

export function createBadge(
    fileName: string,
    getOptions: () => BadgeOptions,
): void {
    const { label, labelColor, message, messageColor } = getOptions();

    const options: string[] = [];

    addOption("--file-name", fileName);
    addOption("--message", message);
    addOption("--message-color", messageColor);
    addOption("--label", label);
    addOption("--label-color", labelColor);

    exec(`badges create ${options.join(" ")}`);

    function addOption(key: string, value?: string): void {
        if (value) options.push(`${key}=${JSON.stringify(value)}`);
    }
}
