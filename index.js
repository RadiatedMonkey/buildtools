const chalk = require("chalk");
const childProc = require("child_process");

console.clear();

let worker = childProc.fork("./server.js");
worker.on('exit', restart);

function restart() {
    console.log(chalk.bgRed("  ERROR  "), "BuildTools crashed");
    console.log("\n============================== Restarted ==============================\n");
    worker = childProc.fork("./server.js");
    worker.on("exit", restart);
}