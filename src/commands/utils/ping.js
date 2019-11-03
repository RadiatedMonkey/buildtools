const tellraw = require("../tellraw");
const prepareCommand = require("../commandGenerator");
module.exports = function(ws, res) {
    ws.send(prepareCommand(tellraw(res.properties.Sender, "Pong")));
}