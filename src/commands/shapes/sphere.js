const sphere = require("../shared/shapes/sphereGenerator");
const generateBlocks = require("../shared/blockGenerator");
const blockSetter = require("../shared/blockSetter");

module.exports = function(ws, res) {
    const sender = res.properties.Sender;
    const msg = res.properties.Message;
    const args = msg.split(" ").slice(1);
    const spherePositions = sphere({radius: args[0], fill: args[1] === "true" ? true : false});
    const sphereBlocks = generateBlocks(spherePositions, args[args.length - 1]);

    console.log(sphereBlocks);

    blockSetter(ws, sphereBlocks, sender);
}