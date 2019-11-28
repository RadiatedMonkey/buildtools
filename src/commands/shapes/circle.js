const circle = require("../shared/shapes/circleGenerator");
const generateBlocks = require("../shared/blocks/blockGenerator");
const blockSetter = require("../shared/blocks/blockSetter");

module.exports = function(ws, res) {

    const msg = res.properties.Message;
    const radius = Number(msg.split(" ")[1]);

    const circleCoords = circle(radius);
    const circleBlocks = generateBlocks(circleCoords, msg.split(" ")[2]);

    blockSetter(ws, circleBlocks, res.properties.Sender);
};