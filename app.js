const WebSocket = require("ws");
const listeners = require("./src/ws/listeners");
const chalk = require("chalk");
const commandError = require("./src/commands/commandError");

process.on('uncaughtException', function() {
    commandError(listeners.conn, "@a", "BuildTools crashed, reconnect to it with /connect localhost:19131");
    setTimeout(function() {
        process.exit(1);
    }, 100);
});

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
listeners.exec(wss);