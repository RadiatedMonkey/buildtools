const prepareCommand = require("./commandGenerator");

module.exports = function(ws, sender, error) {
    return ws.send(prepareCommand(`tellraw ${sender} {"rawtext":[{"text":"[BuildTools] ${error}"}]}`));
}