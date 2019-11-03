module.exports = function(radius) {
    // -> args: radius
    let coords = [];
    for(let i = -radius; i <= radius; i++) {
        for(let j = -radius; j <= radius; j++) {
            if (i * i + j * j < radius * radius && i * i + j * j >= (radius - 1) * (radius - 1)) {
                coords.push([radius + i, 0, radius + j]);
            }   
        }
    }   
    return coords;
}