const positions = require("../shared/positions");
const prepareCommand = require("../commandGenerator");

module.exports = function(ws, res)
{
      ws.send(prepareCommand(`tp ${res.body.sender} @e[type=minecraft:armor_stand,tag=bt-${positions.armourStands[res.body.sender]}]`));
      ws.send(prepareCommand(`tellraw ${res.body.sender} {"rawtext":[{"text":"[BuildTools] You have been teleported to the currently executing command"}]}`));
}
