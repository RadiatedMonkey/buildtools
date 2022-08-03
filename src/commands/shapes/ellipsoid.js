const ellipsoid = require("../shared/shapes/ellipsoidGenerator");
const generateBlocks = require("../shared/blocks/blockGenerator");
const blockSetter = require("../shared/blocks/blockSetter");
const generateFunctions = require("../shared/blocks/functionGenerator");
const config = require("../../../config/general.json");

module.exports = function(ws, res) {
    const args = res.body.message.split(" ").slice(1);
    const ellipsoidPositions = ellipsoid({width: args[0], height: args[1], length: args[2]});
    
    if(config.useQuickbuild) generateFunctions(ws, ellipsoidPositions, args[args.length - 1]);
    else {
        const ellipsoidBlocks = generateBlocks(ellipsoidPositions, args[args.length - 1], res.body.sender);
        blockSetter(ws, ellipsoidBlocks, res.body.sender);
    }
};