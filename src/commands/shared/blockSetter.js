const positions = require("./positions");
const prepareCommand = require("../commandGenerator");
const config = require("../../../config/general.json");

let blocksPlaced = {};
let commandIntervals = {};

// Format ->
// [
//     [x, y, z],
//     [name, dv]
// ]

module.exports = function(ws, blocks, sender) {
    positions.savePosition(ws, sender);
    blocksPlaced[sender] = 0;
    let blockLength = blocks.length;
    commandIntervals[sender] = setInterval(function() {
        let block = blocks[blocksPlaced[sender]];
        let percFinished = blocksPlaced[sender] / blockLength;
        ws.send(prepareCommand(`title ${sender} actionbar ${"⬛".repeat(20 * percFinished)}${"⬜".repeat(20 - 20 * percFinished)} ${Math.round(percFinished * 100)} percent`));
        ws.send(prepareCommand(`execute @e[type=armor_stand,tag=${positions.armourStands[sender]}] ~~~ setblock ~${block[0][0]+1}~${block[0][1]}~${block[0][2]} ${block[1][0]} ${block[1][1]}`));
        blocksPlaced[sender]++;
        if(blocksPlaced[sender] === blockLength) onIntervalEnd(ws, sender);
        if(!positions.armourStands[sender]) clearInterval(commandIntervals[sender]);
    }, config.command_delay ? config.command_delay : 10);
};

function onIntervalEnd(ws, sender) {
    positions.removeArmourStand(ws, sender);
    delete blocksPlaced[sender];
}