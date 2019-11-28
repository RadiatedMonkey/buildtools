const generateBlocks = require("../shared/blocks/blockGenerator");
const blockSetter = require("../shared/blocks/blockSetter");

module.exports = function(ws, res) {

    const msg = res.properties.Message;
    let args = msg.split(" ").slice(1);

    // args -> x y z block

    let coords = [];
    for(let x = 0, i = Number(args[0]); x < i; x++) {
        for(let y = 0, j = Number(args[1]); y < j; y++) {
            for(let z = 0, k = Number(args[2]); z < k; z++) {
                coords.push([x, y, z]);
            }
        }
    }

    const blocks = generateBlocks(coords, args[args.length - 1]);
    blockSetter(ws, blocks, res.properties.Sender);
}