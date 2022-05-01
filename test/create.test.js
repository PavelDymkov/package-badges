const { config } = require("./lib/constants");
const { badge, prepareTest, readme, readmeIs } = require("./lib/tools");

const { create } = require("../package/index");

const name = "test";
const message = "message";

describe("create", () => {
    beforeEach(prepareTest);

    it("should create badge", () => {
        readme("");

        create(name, { config, message });

        readmeIs(badge(name, message));
    });

    it("should create badges", () => {
        readme("");

        create(name, { config, message });

        const name2 = name + "-x";
        const message2 = message + "-x";

        create(name2, { config, message: message2 });

        readmeIs(badge(name, message), badge(name2, message2));
    });

    it("should replace badge", () => {
        readme("");

        create(name, { config, message });

        readmeIs(badge(name, message));

        create(name, { config, message });

        readmeIs(badge(name, message));
    });

    it("should create badge with label", () => {
        readme("");

        const label = "label";

        create(name, { config, label, message });

        readmeIs(badge(name, `${label}: ${message}`));
    });

    it("should add to readme with header", () => {
        readme("# Header");

        create(name, { config, message });

        readmeIs("# Header\n\n", badge(name, message));
    });

    it("should add to readme with header and content", () => {
        readme("# Header\n\nContent");

        create(name, { config, message });

        readmeIs("# Header\n\n", badge(name, message), "\nContent\n");
    });

    it("should add to readme with header, badges and content", () => {
        readme(`
            # Header

            ![a](x.svg)
            ![b](y.svg)
            
            Content
        `);

        create(name, { config, message });

        readmeIs(
            "# Header\n\n",
            "![a](x.svg)\n",
            "![b](y.svg)\n",
            badge(name, message),
            "\nContent\n",
        );
    });

    // it("should create badge", () => {
    //     readme("");

    //     const name = "test";
    //     const message = "message";

    //     create(name, { config, message });

    //     const badge = join(badges, name + ".svg");

    //     ok(test("-f", badge));

    //     readmeIs(
    //         `![${message}](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/${badge})\n`,
    //     );
    // });
});
