const fs = require("fs");

module.exports = function(msg)
{
    fs.appendFileSync("./temp/errors.log", `[${new Date().toLocaleString()}] ${msg}\n`);
}