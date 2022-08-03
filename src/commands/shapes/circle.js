const circle = require("../shared/shapes/circleGenerator");
const generateBlocks = require("../shared/blocks/blockGenerator");
const generateFunctions = require("../shared/blocks/functionGenerator");
const blockSetter = require("../shared/blocks/blockSetter");

module.exports = function(ws, res) {

    const msg = res.body.message;
    const radius = Number(msg.split(" ")[1]);

    const circleCoords = circle(radius);

    if(config.useQuickbuild) generateFunctions(ws, circleCoords, msg.split(" ")[2]);
    else {
        const circleBlocks = generateBlocks(circleCoords, msg.split(" ")[2], res.body.sender);
        blockSetter(ws, circleBlocks, res.body.sender);
    }
};