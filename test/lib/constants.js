const { join } = require("path");

exports.config = join("test", ".badges.json");
exports.temp = join("test", "temp");
exports.badges = join(exports.temp, "badges");
