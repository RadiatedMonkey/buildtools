const path = require("path");
const subscribe = require("./subscribe");
const prepareCommand = require("../commands/commandGenerator");
const tellraw = require("../commands/tellraw");
const chalk = require("chalk");
const permission = require("../commands/shared/permission");
const commands = require("../../data/commands.json");
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

        connection.send(prepareCommand('tellraw @a {"rawtext":[{"text":"[BuildTools] Use !cmds to get a list of WorldEdit commands"}]}'));
        subscribe(connection, "PlayerMessage");

        connection.on("message", packet => {
            const res = JSON.parse(packet);
                    
            // if(res.body.statusMessage) 
            //     console.log(res.body.statusMessage);

            if(res.body.hasOwnProperty("statusMessage")) {
                if(res.body.statusMessage.startsWith("Too many commands") && !tooFastLogged) {
                    connection.send(prepareCommand(`tellraw @a {"rawtext":[{"text":"[BuildTools] Commands are being sent too fast, the host might need to increase the command_delay in config/general.json"}]}`));
                    tooFastLogged = true;
                }
            }

            if(res.body.eventName === "PlayerMessage" && res.body.properties.Sender !== "External") {

                const playerMessage = res.body.properties.Message;
                const sender = res.body.properties.Sender;

                console.log(playerMessage);

                Object.keys(commands).forEach(command => {
                    if(playerMessage.startsWith("!" + command)) {
                        const hasPermission = permission.checkPermission(sender, command);
                        if(hasPermission) {
                            if(loadedCommands[command]) return loadedCommands[command](connection, res.body);
                            
                            loadedCommands[command] = require(path.join(__dirname, "../commands", commands[command]));
                            loadedCommands[command](connection, res.body);
                        } else {
                            connection.send(prepareCommand(tellraw(sender, "[BuildTools] You do not have permission to use this command")));
                        }
                    }
                });

            }
        });
    });

}