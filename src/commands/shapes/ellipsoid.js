const ellipsoid = require("../shared/shapes/ellipsoidGenerator");
const generateBlocks = require("../shared/blocks/blockGenerator");
const blockSetter = require("../shared/blocks/blockSetter");

module.exports = function(ws, res) {
    const args = res.properties.Message.split(" ").slice(1);
    const ellipsoidPositions = ellipsoid({width: args[0], height: args[1], length: args[2]});
    const ellipsoidBlocks = generateBlocks(ellipsoidPositions, args[args.length - 1]);
    blockSetter(ws, ellipsoidBlocks, res.properties.Sender);
};