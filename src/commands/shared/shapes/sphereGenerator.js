module.exports = function(args) {
    let blocks = generateBlocks(args.radius);

    if (!args.fill) {
        blocks = purgeBlocks(blocks);
    }

    return createCoordGrid(blocks);
};

function generateBlocks(radius) {
    let radiusSq = radius * radius;
    let halfSize, size, offset;

    halfSize = Math.ceil(radius) + 1;
    size = halfSize * 2;
    offset = halfSize - 0.5;

    function isFull(x, y, z) {
        x -= offset;
        y -= offset;
        z -= offset;
        x *= x;
        y *= y;
        z *= z;

        return x + y + z < radiusSq;
    }

    let blocks = [];

    for (let z = 0; z < size; z++) {
        let slice = blocks[z] = [];
        for (let x = 0; x < size; x++) {
            let row = slice[x] = [];
            for (let y = 0; y < size; y++) {
                row[y] = isFull(x, y, z);
            }
        }
    }

    return blocks;
}

function purgeBlocks(blocks) {
    let newblocks = [];
    for (let z = 0; z < blocks.length; z++) {
        let slice = blocks[z];
        let newslice = newblocks[z] = [];
        for (let x = 0; x < slice.length; x++) {
            let row = slice[x];
            let newrow = newslice[x] = [];
            for (let y = 0; y < row.length; y++) {
                newrow[y] = row[y] && (!row[y - 1] || !row[y + 1] || !slice[x - 1][y] || !slice[x + 1][y] || !blocks[z - 1][x][y] || !blocks[z + 1][x][y]);
            }
        }
    }

    return newblocks;
}

function createCoordGrid(blocks) {
    let x, y, z;
    let positions = [];
    let prevSlice = blocks[0];
    for(z = 1; z < blocks.length - 1; z++) {
        let slice = blocks[z];
        for(x = 0; x < slice.length; x++) {
            let row = slice[x];
            for(y = 0; y < row.length; y++) {
                prev = prevSlice[x][y];
                if(row[y]) {
                    positions.push([x, y, z]);
                }
            }
        }
    }

    return positions;
}