module.exports = function(args) {
    let {
        width,
        height,
        length
    } = args;

    let coords = [];
    for(let i = -length; i <= length; i++) {
        for(let j = -width; j <= width; j++) {
            for(let k = -height; k <= height; k++) {
                if((i * i) / (length * length) + (j * j) / (width * width) + (k * k) / (height * height) <= 1) {
                    coords.push([i, j, k]);
                }
            }
        }
    }

    return coords;
};