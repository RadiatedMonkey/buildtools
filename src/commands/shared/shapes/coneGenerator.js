module.exports = function(arguments) {

    let coords = [];
    let {height, radius} = arguments;


    for(let m = height; m >= 0; m--) {
        for(let i = -radius; i <= radius; i++) {
            for(let j = -radius; j <= radius; j++) {
                let u = radius / height * m;
                if (i * i + j * j <= u * u && i * i + j * j >= (u - 1) * (u - 1)) {
                    coords.push([i, height - m, j]);
                }
            }
        }
    }
    for(let m = radius; m > 0; m--) {
        for(let i = -radius; i <= radius; i++) {
            for(let j = -radius; j <= radius; j++) {
                let u = height / radius * m;
                if (i * i + j * j <= (radius - m) * (radius - m) && i * i + j * j >= ((radius - m) - 1) * ((radius - m) - 1)) {
                    coords.push([i, u, j]);
                }
            }
        }
    }

    return coords;

}