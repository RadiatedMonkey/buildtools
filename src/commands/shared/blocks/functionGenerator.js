"use strict";

const fs = require("fs")

const config = require("../../../../config/general.json");
const executeFunctions = require("../functionExecutor");
const generateBlockList = require("../blocks/blockListGenerator");

module.exports = function(ws, positions, blockList, player, listAlreadyGenerated = false) {
    fs.readdirSync(config.functionpack_location).forEach(function(file) {
        if(file === "functions") return;

        fs.writeFileSync(config.functionpack_location + "/" + file, "");
    });

    let generatedBlocks = [];
    if(!listAlreadyGenerated)
        generatedBlocks = generateBlockList(positions, blockList);
    else generatedBlocks = blockList

    let functionLines = [];
    let currentChunk = 0;
    for(let i = 0, n = generatedBlocks.length; i < n; i++) {
        if(generatedBlocks[i][0] === "nothing") continue;
        functionLines.push(`setblock ~${generatedBlocks[i][0][0]}~${generatedBlocks[i][0][1]}~${generatedBlocks[i][0][2]} ${generatedBlocks[i][1][0]} ${generatedBlocks[i][1][1]}`);
        if(functionLines.length === 10000) {
            fs.writeFileSync(
                config.functionpack_location + `/buildtools_chunk_${currentChunk}.mcfunction`,
                functionLines.join("\n")
            );
            functionLines = [];
            currentChunk++;
        }
    }
    fs.writeFileSync(
        config.functionpack_location + `/buildtools_chunk_${currentChunk}.mcfunction`,
        functionLines.join("\n")
    );

    executeFunctions(ws, player, currentChunk + 1, blockList.length);
}