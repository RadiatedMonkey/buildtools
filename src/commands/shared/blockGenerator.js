"use strict";

const shuffle = require("./shuffle");

module.exports = function(positions, blockArg) {

    if(!blockArg.includes("%")) blockArg = "100%" + blockArg;
    blockArg = blockArg.split(",").map(x => x = x.split(/[%:]/g));
    blockArg = blockArg.map(x => {
        x[0] = Number(x[0]);
        x[2] ? x[2] = Number(x[2]) : x[2] = 0;
        return x;
    });

    let blockList = [];
    blockArg.forEach(function(block) {
        for(let i = 0; i < positions.length * (block[0] / 100); i++) {
            blockList.push([block[1], block[2]]);
        }
    });

    blockList = shuffle(blockList);

    console.log(positions.length, blockList.length);

    let finalList = [];
    positions.forEach(function(position, idx) {
        finalList.push([position, blockList[idx]]);
    });

    return finalList;

}