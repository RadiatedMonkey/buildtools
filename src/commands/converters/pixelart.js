// Syntax -> !pixel-art <url> <size> <vertical>

const url = require("url");
const https = require("https");
const http = require("http");
const Jimp = require("jimp");
const sizeOf = require("image-size");
const blocks = require("../../../data/blocks.json");
const blockSetter = require("../shared/blockSetter");
const prepareCommand = require("../commandGenerator");

let positions = [];

module.exports = function(ws, res) {
    const args = res.properties.Message.split(" ").slice(1);
    let [
        imgUrl,
        newWidth,
        isVertical
    ] = args;
    
    if(imgUrl.startsWith("http://")) protocol = http;
    else protocol = https;
    ws.send(prepareCommand(`tellraw ${res.properties.Sender} {"rawtext":[{"text":"[PixelArt] Retrieving image..."}]}`));
    protocol.get(url.parse(imgUrl), function(response) {
        let chunks = [];

        response.on("data", function(chunk) {
            chunks.push(chunk);
        }).on("end", function() {
            ws.send(prepareCommand(`tellraw ${res.properties.Sender} {"rawtext":[{"text":"[PixelArt] Processing image..."}]}`));
            const buffer = Buffer.concat(chunks);
            useImage(buffer);
            chunks = [];
        });
    });

    function useImage(imageBuffer) {
        isVertical ? isVertical = isVertical === "true" ? true : false : null;

        let size = sizeOf(imageBuffer);        

        Jimp.read(imageBuffer, (err, image) => {
            if(err) throw err;

            isVertical ? image.flip(false, true) : null;

            if(newWidth) {
                let scaleDifference = newWidth / size.width;
                image.scale(scaleDifference);
                size.width *= scaleDifference;
                size.height *= scaleDifference;
            }

            let pixels = [];
            for(let x = 0; x < size.width; x++) {
                for(let y = 0; y < size.height; y++) {
                    pixels.push(Jimp.intToRGBA(image.getPixelColor(x, y)));
                    positions.push([[x, isVertical ? y : 0, isVertical ? 0 : y]]);
                }
            }

            function colorDifference(val1, val2) {
                var sumOfSquares = 0;
            
                sumOfSquares += Math.pow(val1.r - val2[0], 2);
                sumOfSquares += Math.pow(val1.g - val2[1], 2);
                sumOfSquares += Math.pow(val1.b - val2[2], 2);
                
                return Math.sqrt(sumOfSquares);
            }

            let blockKeys = Object.keys(blocks);
            pixels.forEach((pixel, idx) => {
                let distances = [];
                blockKeys.forEach(key => {
                    distances.push(colorDifference(pixel, blocks[key]));
                });

                let min = {idx: 0, val: distances[0]};
                distances.forEach((distance, idx) => {
                    if(distance < min.val) {
                        min.val = distance;
                        min.idx = idx;
                    }
                });

                let block = blockKeys[min.idx];
                if(block.includes(" ")) block = block.split(" ");
                else block = [block, 0];

                positions[idx][1] = block;
            });

            ws.send(prepareCommand(`tellraw ${res.properties.Sender} {"rawtext":[{"text":"[PixelArt] Placing pixel art..."}]}`));
            blockSetter(ws, positions, res.properties.Sender);

            positions = [];
            pixels = [];
            size = {};

        });

    }
}