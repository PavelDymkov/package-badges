const { ok } = require("assert");
const { not } = require("logical-not");
const { join } = require("path");
const { mkdir, test, touch } = require("shelljs");

const { config, badges } = require("./lib/constants");
const { prepareTest, readme, readmeIs } = require("./lib/tools");

const { clean } = require("../package/index");

describe("clean", () => {
    beforeEach(prepareTest);

    it("should delete badges", () => {
        readme(``);

        const badge = join(badges, "badge.svg");

        mkdir(badges);
        touch(badge);

        clean({ config });

        ok(not(test("-f", badge)));
    });

    it("should clean readme", () => {
        readme(`
            ![build: passing](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/build.svg)

            text
        `);

        clean({ config });

        readmeIs("text\n");
    });

    it("should clean readme with header", () => {
        readme(`
            # Header

            ![build: passing](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/build.svg)

            text
        `);

        clean({ config });

        readmeIs("# Header\n\ntext\n");
    });

    it("should clean readme with badge before header", () => {
        readme(`
            ![build: passing](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/build.svg)

            # Header

            text
        `);

        clean({ config });

        readmeIs("# Header\n\ntext\n");
    });

    it("should clean incorrect readme", () => {
        readme(`
            # Header
            ![build: passing](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/build.svg)
            text
        `);

        clean({ config });

        readmeIs("# Header\n\ntext\n");
    });

    it("should clean readme with many badges", () => {
        readme(`
            # Header

            ![build: passing](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/build.svg)
            ![license: ISC](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/license.svg)
            ![Make: Badges](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/fun.svg)

            text
        `);

        clean({ config });

        readmeIs("# Header\n\ntext\n");
    });

    it("should clean readme with many badges without header", () => {
        readme(`
            ![build: passing](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/build.svg)
            ![license: ISC](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/license.svg)
            ![Make: Badges](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/fun.svg)

            text
        `);

        clean({ config });

        readmeIs("text\n");
    });

    it("should clean readme without body", () => {
        readme(`
            ![build: passing](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/build.svg)
        `);

        clean({ config });

        readmeIs("\n");
    });

    it("should clean readme without body with header", () => {
        readme(`
            # Header

            ![build: passing](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/build.svg)
        `);

        clean({ config });

        readmeIs("# Header\n");
    });
});
