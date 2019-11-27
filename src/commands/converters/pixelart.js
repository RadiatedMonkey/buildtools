// Syntax -> !pixel-art <url> <size> <vertical>

const url = require("url");
const https = require("https");
const http = require("http");
const Jimp = require("jimp");
const blocks = require("../../../data/blocks.json");
const blockSetter = require("../shared/blockSetter");
const prepareCommand = require("../commandGenerator");
const commandError = require("../commandError");

let positions = [];

module.exports = function(ws, res) {
    const args = res.properties.Message.split(" ").slice(1);
    let [
        imgUrl,
        newWidth,
        newHeight,
        isVertical,
        filters
    ] = args;

    newWidth = Number(newWidth);
    newHeight = Number(newHeight);

    // Download image
    
    if(imgUrl.startsWith("http://")) protocol = http;
    else if(imgUrl.startsWith("https://")) protocol = https;
    else return commandError(ws, res.properties.Sender, "Unrecognized image url protocol, the url must start with http:// or https://");

    ws.send(prepareCommand(`tellraw ${res.properties.Sender} {"rawtext":[{"text":"[BuildTools] Downloading image..."}]}`));
    protocol.get(url.parse(imgUrl), function(response) {
        let chunks = [];

        response.on("data", function(chunk) {
            chunks.push(chunk);
            console.log(chunk.byteLength);
        }).on("end", function() {
            ws.send(prepareCommand(`tellraw ${res.properties.Sender} {"rawtext":[{"text":"[BuildTools] Processing image..."}]}`));
            const buffer = Buffer.concat(chunks);
            useImage(buffer);
            chunks = [];
        });
    });

    function imageEffect(image, effects) {
        
        

    }

    function useImage(imageBuffer) {
        isVertical ? isVertical = isVertical === "true" ? true : false : null;

        // let size = sizeOf(imageBuffer);        

        Jimp.read(imageBuffer, function(err, image) {
            if(err) throw err;

            isVertical ? image.flip(false, true) : null;

            // if(newWidth) {
            //     let scaleDifference = newWidth / size.width;
            //     image.scale(scaleDifference);
            //     size.width *= scaleDifference;
            //     size.height *= scaleDifference;
            // }

            // image.contain(newWidth, newHeight);
            image.scaleToFit(newWidth, newHeight, Jimp.RESIZE_BILINEAR);
            // image.dither565();

            let pixels = [];
            for(let x = 0; x < image.bitmap.width; x++) {
                for(let y = 0; y < image.bitmap.height; y++) {
                    pixels.push(Jimp.intToRGBA(image.getPixelColor(x, y)));
                    positions.push([[x, isVertical ? y : 0, isVertical ? 0 : y]]);
                }
            }

            function colorDifference(val1, val2) {
                let sum = 0;
            
                sum += Math.pow(val1.r - val2[0], 2);
                sum += Math.pow(val1.g - val2[1], 2);
                sum += Math.pow(val1.b - val2[2], 2);
                
                return Math.sqrt(sum);
            }

            let blockKeys = Object.keys(blocks);
            pixels.forEach(function(pixel, idx) {
                let distances = [];
                // blockKeys.forEach(function(key) {
                //     distances.push(colorDifference(pixel, blocks[key]));
                // });

                for(let i = 0, n = blockKeys.length; i < n; i++) {
                    distances.push(colorDifference(pixel, blocks[blockKeys[i]]));
                }

                let min = 0;
                // distances.forEach(function(distance, idx) {
                //     if(distance < min.val) {
                //         min.val = distance;
                //         min.idx = idx;
                //     }
                // });

                for(let i = 0, n = distances.length; i < n; i++) {
                    if(distances[i] < distances[min])
                        min = i;
                }

                let block = blockKeys[min];
                if(block.includes(" ")) block = block.split(" ");
                else block = [block, 0];

                positions[idx][1] = block;
            });

            // ws.send(prepareCommand(`fill ~~~ ~${image.bitmap.width}~${image.bitmap.height}~ `));
            ws.send(prepareCommand(`tellraw ${res.properties.Sender} {"rawtext":[{"text":"[PixelArt] Placing pixel art..."}]}`));
            blockSetter(ws, positions, res.properties.Sender);

            positions = [];
            pixels = [];
            size = {};

        });

    }
}