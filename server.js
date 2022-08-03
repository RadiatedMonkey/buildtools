const fs = require("fs");

const WebSocket = require("ws");
const listeners = require("./src/ws/listeners");
const chalk = require("chalk");

if(!fs.existsSync("./temp")) fs.mkdirSync("./temp");
if(!fs.existsSync("./temp/uuids")) fs.writeFileSync("./temp/uuids", "");
if(!fs.existsSync("./temp/errors.log")) fs.writeFileSync("./temp/errors.log", "");

let wss = null;
let idx = 0;

const loader = setInterval(function() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(chalk.bgCyan(["/","-","\\","|"][idx++]) + " Starting server");
    idx &= 3;
}, 100);

wss = new WebSocket.Server({
    port: 19131
});

wss.on("listening", function() {
    clearInterval(loader);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log("Server running on ws://localhost:19131");
    listeners.exec(wss);
});