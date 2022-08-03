const positions = require("../shared/positions");
module.exports = function(ws, res) {
    positions.removeArmourStand(ws, res.body.sender);
};