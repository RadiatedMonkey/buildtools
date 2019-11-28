const WebSocket = require("ws");
const listeners = require("./src/ws/listeners");
const chalk = require("chalk");

let wss = null;
let idx = 0;

const loader = setInterval(function() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(chalk.blue(["/","-","\\","|"][idx++]) + " Starting server");
    idx &= 3;
}, 100);

wss = new WebSocket.Server({
    port: 19131
});

clearInterval(loader);
process.stdout.clearLine();
process.stdout.cursorTo(0);
console.log(chalk.green("✓") + " Server running on ws://localhost:19131");
listeners(wss);