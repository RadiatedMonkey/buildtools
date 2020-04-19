const prepareCommand = require("../commandGenerator");
const tellraw = require("../tellraw");
const config = require("../../../config/general.json");

module.exports = function(ws, player, chunkCount, blockCount) {
    ws.send(tellraw(player, "Reloading functions, Minecraft will become unresponsive"));
    ws.send(prepareCommand("reload"));
    ws.send(tellraw(player, `Placing ${blockCount} blocks (${chunkCount} functions)`));

    setTimeout(function() {
        for(let i = 0; i < chunkCount; i++) {
            setTimeout(function() {
                ws.send(prepareCommand(`function buildtools_chunk_${i}`));
            }, config.function_delay * i);
        }
    }, 100);
}