const generateBlocks = require("../shared/blockGenerator");
const blockSetter = require("../shared/blockSetter");

module.exports = function(ws, res) {

    const msg = res.properties.Message;
    let args = msg.split(" ").slice(1);

    // args -> x y z block

    let coords = [];
    for(let x = 0; x < Number(args[0]); x++) {
        for(let y = 0; y < Number(args[1]); y++) {
            for(let z = 0; z < Number(args[2]); z++) {
                coords.push([x, y, z]);
            }
        }
    }

    const blocks = generateBlocks(coords, args[args.length - 1]);
    blockSetter(ws, blocks, res.properties.Sender);
}