const chalk = require("chalk");
const childProc = require("child_process");
const fs = require("fs");

const config = require("./config/general.json");

for(let i = 0; i < 100; i++) {
    if(!fs.existsSync(config.functionpack_location + `/buildtools_chunk_${i}.mcfunction`)) {
        fs.writeFileSync(config.functionpack_location + `/buildtools_chunk_${i}.mcfunction`, '');
    }
}

let worker = childProc.fork("./server.js");
worker.on('exit', restart);

function restart() {
    console.log(chalk.bgRed("  ERROR  "), "BuildTools crashed");
    console.log("\n============================== Restarted ==============================\n");
    worker = childProc.fork("./server.js");
    worker.on("exit", restart);
}