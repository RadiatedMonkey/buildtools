const cone = require("../shared/shapes/coneGenerator");
const generateBlocks = require("../shared/blocks/blockGenerator");
const blockSetter = require("../shared/blocks/blockSetter");
const generateFunctions = require("../shared/blocks/functionGenerator");
const config = require("../../../config/general.json");

module.exports = function(ws, res) {

    const args = res.properties.Message.split(" ").slice(1);
    const conePositions = cone({radius: args[0], height: args[1]});

    if(config.useQuickbuild) generateFunctions(ws, conePositions, args[args.length - 1]);
    else {
        const coneBlocks = generateBlocks(conePositions, args[args.length - 1], res.properties.Sender);
        blockSetter(ws, coneBlocks, res.properties.Sender);
    }
}