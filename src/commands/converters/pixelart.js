const url = require("url");
const https = require("https");
const http = require("http");

const Jimp = require("jimp");
const blocks = require("../../../data/blocks.json");
const blockSetter = require("../shared/blocks/blockSetter");
const generateFunctions = require("../shared/blocks/functionGenerator");
const config = require("../../../config/general.json");
const prepareCommand = require("../commandGenerator");
const commandError = require("../commandError");

let positions = [];

module.exports = function(ws, res) {
    const args = res.body.message.split(" ").slice(1);
    let [
        imgUrl,
        newWidth,
        newHeight,
        isVertical,
        filters
    ] = args;

    newWidth = Number(newWidth);
    newHeight = Number(newHeight);

    if(!imgUrl) return commandError(ws, res.body.sender, "An image location is required");
    if(isNaN(newWidth)) return commandError(ws, res.body.sender, "An image width is required");
    if(isNaN(newHeight)) return commandError(ws, res.body.sender, "An image height is required");
    if(!isVertical) isVertical = true;

    if(imgUrl.startsWith("http://")) protocol = http;
    else if(imgUrl.startsWith("https://")) protocol = https;
    else return commandError(ws, res.body.sender, "Unrecognized image url protocol, the url must start with http:// or https://");

    ws.send(prepareCommand(`tellraw ${res.body.sender} {"rawtext":[{"text":"[BuildTools] Downloading image..."}]}`));
    protocol.get(url.parse(imgUrl), function(response) {
        let chunks = [];

        response.on("data", function(chunk) {
            chunks.push(chunk);
        }).on('error', function(err) {
            commandError(ws, res.body.sender, "Failed to load image");
            console.error(err);
        }).on("end", function() {
            ws.send(prepareCommand(`tellraw ${res.body.sender} {"rawtext":[{"text":"[BuildTools] Processing image..."}]}`));
            const buffer = Buffer.concat(chunks);
            chunks = [];
            useImage(buffer);
        });
    });

    function imageEffect(image) {

        // if(!(/([A-Za-z]{4,}\((|[0-9])\)){1,}/gi).test(filters))
        //     return commandError(ws, res.body.sender, "The filters argument has invalid syntax, filters have been skipped");

        filters = filters.split(",").map(function(x) {
            let tempX = x.split("(");
            return [tempX[0], tempX[1].replace(")", "")];
        });

        for(let i = 0, n = filters.length; i < n; i++) {
            switch(filters[i][0]) {
                case 'greyscale':
                    image.greyscale();
                    break;

                case 'invert':
                    image.invert();
                    break;

                case 'dither':
                    image.dither565();
                    break;

                case 'normalize':
                    image.normalize();
                    break;

                case 'blur':
                    const fArg = Number(filters[i][1]);
                    if(isNaN(fArg))
                        commandError(ws, res.body.sender, "The blur filter should receive a number, it has been skipped");
                    else
                        image.blur(fArg);
                    break;

                case 'sepia':
                    image.sepia();
                    break;

                case 'opaque':
                    image.opaque();
                    break;

                case 'gaussian':
                    const gArg = Number(filters[i][1]);
                    if(isNaN(gArg))
                        commandError(ws, res.body.sender, "The gaussian blur filter should receive a number, it has been skipped");
                    else
                        image.gaussian(gArg);
                    break;

                case 'posterize':
                    const pArg = Number(filters[i][1]);
                    if(isNaN(pArg))
                        commandError(ws, res.body.sender, "The posterize filter should receive a number, it has been skipped");
                    else
                        image.posterize(pArg);
                    break;

                default:
                    commandError(ws, res.body.sender, `Unknown image filter: '${filters[i][0]}', it has been skipped`);
                    break;
            }
        }
    }

    function useImage(imageBuffer) {
        isVertical ? isVertical = isVertical === "true" ? true : false : null;
        Jimp.read(imageBuffer, function(err, image) {
            if(err) {
                commandError(ws, res.body.sender, err);
                return;
            }
            isVertical ? image.flip(false, true) : null;
            image.scaleToFit(newWidth, newHeight, Jimp.RESIZE_HERMITE);
            if(filters) imageEffect(image);
            let pixels = [];
            for(let x = 0; x < image.bitmap.width; x++) {
                for(let y = 0; y < image.bitmap.height; y++) {
                    let pxColor = Jimp.intToRGBA(image.getPixelColor(x, y));
                    if(pxColor.a < 0.5) continue;
                    pixels.push(pxColor);
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
                if(pixel !== null) {
                    for(let i = 0, n = blockKeys.length; i < n; i++) {
                        distances.push(colorDifference(pixel, blocks[blockKeys[i]]));
                    }
                    let min = 0;
                    for(let i = 0, n = distances.length; i < n; i++) {
                        if(distances[i] < distances[min])
                            min = i;
                    }
                    let block = blockKeys[min];
                    if(block.includes(" ")) block = block.split(" ");
                    else block = [block, 0];
                    positions[idx][1] = block;
                }
            });

            if(config.useQuickbuild) generateFunctions(ws, null, positions, res.body.sender, true);
            else blockSetter(ws, positions, res.body.sender);

            // Cleanup
            positions = [];
            pixels = [];
            size = {};
        });
    }
}
