const generateBlocks = require("../shared/blocks/blockGenerator");
const blockSetter = require("../shared/blocks/blockSetter");
const generateFunctions = require("../shared/blocks/functionGenerator");
const config = require("../../../config/general.json");

module.exports = function(ws, res) {

    const msg = res.body.message;
    let args = msg.split(" ").slice(1);

    let coords = [];
    for(let x = 0, i = Number(args[0]); x < i; x++) {
        for(let y = 0, j = Number(args[1]); y < j; y++) {
            for(let z = 0, k = Number(args[2]); z < k; z++) {
                coords.push([x, y, z]);
            }
        }
    }

    if(config.useQuickbuild) generateFunctions(ws, coords, args[args.length - 1], res.body.sender);
    else {
        const blocks = generateBlocks(coords, args[args.length - 1]);
        blockSetter(ws, blocks, res.body.sender);
    }
}