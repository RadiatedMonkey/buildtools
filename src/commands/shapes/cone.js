const cone = require("../shared/shapes/coneGenerator");
const generateBlocks = require("../shared/blocks/blockGenerator");
const blockSetter = require("../shared/blocks/blockSetter");

module.exports = function(ws, res) {

    const args = res.properties.Message.split(" ").slice(1);
    const conePositions = cone({radius: args[0], height: args[1]});
    const coneBlocks = generateBlocks(conePositions, args[args.length - 1]);

    blockSetter(ws, coneBlocks, res.properties.Sender);

}