const fs = require("fs");
const path = require("path");

const subscribe = require("./subscribe");
const prepareCommand = require("../commands/commandGenerator");
const chalk = require("chalk");
const permission = require("../commands/shared/permission");
const commands = require("../../data/commands.json");
const commandError = require("../commands/commandError");
const loadedCommands = {};

let tooFastLogged = false;

module.exports = function(wss) {

    let idx = 0;
    const loader = setInterval(function() {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(chalk.cyan("!") + " Waiting for connection" + chalk.cyan(
            [
                ".  ",
                ".. ",
                "...",
                " ..",
                "  .",
                "  .",
                " ..",
                "...",
                ".. ",
                ".  "
            ][idx++]
        ) + "\t" + chalk.bold.cyan("Use /connect localhost:19131 to connect to the WorldEdit server"));
        idx > 8 ? idx = 0 : null;
    }, 200);

    wss.on("connection", connection => {

        clearInterval(loader);
        delete idx;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        console.log(chalk.green("✓") + " Connection established");

        if(fs.existsSync("./temp/uuids")) {
            const uuids = fs.readFileSync("./temp/uuids", "UTF-8").split("\n");
            for(let i = 0, n = uuids.length; i < n; i++) {
                connection.send(prepareCommand(`kill @e[type=minecraft:armor_stand,tag="bt-${uuids[i]}"]`));
            }
        }
        if(!fs.existsSync("./temp")) fs.mkdirSync("./temp");
        fs.writeFileSync("./temp/uuids", "");
        
        connection.send(prepareCommand('tellraw @a {"rawtext":[{"text":"§a[BuildTools] Use !cmds to get a list of WorldEdit commands"}]}'));
        subscribe(connection, "PlayerMessage");

        connection.on("message", packet => {
            const res = JSON.parse(packet);

            if(res.body.hasOwnProperty("statusMessage")) {
                if(res.body.statusMessage.startsWith("Too many commands") && !tooFastLogged) {
                    connection.send(prepareCommand(`tellraw @a {"rawtext":[{"text":"§c[BuildTools] Commands are being sent too fast, the host might need to increase the command_delay in config/general.json"}]}`));
                    tooFastLogged = true;
                }
            }

            if(res.body.eventName === "PlayerMessage" && res.body.properties.Sender !== "External" && res.body.properties.Message.startsWith("!")) {
                let commandFound = false;
                Object.keys(commands).forEach(command => {
                    if(res.body.properties.Message.startsWith("!" + command)) {
                        commandFound = true;
                        const hasPermission = permission.checkPermission(res.body.properties.Sender, command);
                        if(hasPermission) {
                            if(loadedCommands[command]) return loadedCommands[command](connection, res.body);
                            
                            loadedCommands[command] = require(path.join(__dirname, "../commands", commands[command]));
                            loadedCommands[command](connection, res.body);
                        } else
                            commandError(connection, res.body.properties.Sender, `You do not have permission to use the '${command}' command`);
                    }
                });

                if(!commandFound)
                    connection.send(prepareCommand(`tellraw ${res.body.properties.Sender} {"rawtext":[{"text":"§c[BuildTools] Unknown command '${res.body.properties.Message.split(" ")[0].slice(1)}'"}]}`));
            }
        });
    });

}