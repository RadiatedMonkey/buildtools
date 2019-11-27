module.exports = function(args) {
    let {length, width} = args;

    let coords = [];
    for (let i = -length; i <= length; i++) {
        for (let j = -width; j <= width; j++) {
            if ((i * i) / (length * length) + (j * j) / (width * width) < 1) {
                coords.push([i, -1, j]);
            }
        }
    }

    return coords;
}