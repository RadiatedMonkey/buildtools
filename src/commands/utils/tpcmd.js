const positions = require("../shared/positions");
const prepareCommand = require("../commandGenerator");

module.exports = function(ws, res)
{
      ws.send(prepareCommand(`tp ${res.properties.Sender} @e[type=minecraft:armor_stand,tag=bt-${positions.armourStands[res.properties.Sender]}]`));
      ws.send(prepareCommand(`tellraw ${res.properties.Sender} {"rawtext":[{"text":"[BuildTools] You have been teleported to the currently executing command"}]}`));
}
