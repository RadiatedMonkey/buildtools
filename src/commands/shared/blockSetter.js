const positions = require("./positions");
const prepareCommand = require("../commandGenerator");
const config = require("../../../config/general.json");

let blocksPlaced = {};

let startTime = new Date();
let commandIntervals = {};

// Format ->
// [
//     [x, y, z],
//     [name, dv]
// ]

module.exports = function(ws, blocks, sender) {
    startTime = new Date();
    positions.savePosition(ws, sender);
    blocksPlaced[sender] = 0;
    commandIntervals[sender] = setInterval(function() {
        let block = blocks[blocksPlaced[sender]];
        ws.send(prepareCommand(`execute @e[type=armor_stand,tag=${positions.armourStands[sender]}] ~~~ setblock ~${block[0][0]+1}~${block[0][1]}~${block[0][2]} ${block[1][0]} ${block[1][1]}`));
        blocksPlaced[sender]++;
        if(blocksPlaced[sender] === blocks.length) onIntervalEnd(ws, sender);
        if(!positions.armourStands[sender]) clearInterval(commandIntervals[sender]);
    }, config.command_delay ? config.command_delay : 10);
};

function onIntervalEnd(ws, sender) {
    console.log(new Date() - startTime);
    positions.removeArmourStand(ws, sender);
    delete blocksPlaced[sender];
}