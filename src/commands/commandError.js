const prepareCommand = require("./commandGenerator");

module.exports = function(ws, sender, error) {
    ws.send(prepareCommand(`execute ${sender} ~~~ playsound random.anvil_land @s ~~~ 0.5`));
    return ws.send(prepareCommand(`tellraw ${sender} {"rawtext":[{"text":"§c[BuildTools] ${error}"}]}`));
}