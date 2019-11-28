const ellipse = require("../shared/shapes/ellipseGenerator");
const generateBlocks = require("../shared/blocks/blockGenerator");
const blockSetter = require("../shared/blocks/blockSetter");

module.exports = function(ws, res) {
    const args = res.properties.Message.split(" ").slice(1);
    const ellipsePositions = ellipse({width: args[0], length: args[1]});
    const ellipseBlocks = generateBlocks(ellipsePositions, args[args.length - 1]);
    blockSetter(ws, ellipseBlocks, res.properties.Sender);
};