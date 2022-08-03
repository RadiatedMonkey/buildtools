const ellipse = require("../shared/shapes/ellipseGenerator");
const generateBlocks = require("../shared/blocks/blockGenerator");
const blockSetter = require("../shared/blocks/blockSetter");
const generateFunctions = require("../shared/blocks/functionGenerator");
const config = require("../../../config/general.json");

module.exports = function(ws, res) {
    const args = res.body.message.split(" ").slice(1);
    const ellipsePositions = ellipse({width: args[0], length: args[1]});
    
    if(config.useQuickbuild) generateFunctions(ws, ellipsePositions, args[args.length - 1]);
    else {
        const ellipseBlocks = generateBlocks(ellipsePositions, args[args.length - 1], res.body.sender);
        blockSetter(ws, ellipseBlocks, res.body.sender);
    }
};