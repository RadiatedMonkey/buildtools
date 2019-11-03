const fs = require("fs");
const chalk = require("chalk");
const commands = require("../../../data/commands.json");

let permissions = {}

if(!fs.existsSync("../../config/permissions.json")) {
    Object.keys(commands).forEach(function(command) {
        permissions[command] = null
    });
    console.log(chalk.cyan("!") + " No permission configuration file");
} else {
    fs.readFile("../../config/permissions.json", "UTF-8", function(err, data) {
        if(err) console.log(err);

        let commandList = Object.keys(commands);
        data = JSON.parse(data);
        data.forEach(function(permission) {
            commandList.forEach(function(command) {
                typeof data[command] === "object"
                if(typeof data[command] === "object") {
                    permissions[command] = data[command]
                } else if(typeof data[command] !== "undefined") {
                    console.log(chalk.red("X") + ` The permission '${command} has an invalid data type (${typeof data[command]})'`);
                } else permissions[command] = null;
            });
        });

        console.log(chalk.green("✓") + " Permissions loaded");
    });
}

module.exports = {
    checkPermission: function(user, command) {
        if(permissions[command] === null) return true;
        if(permissions[command].includes(user)) return true;
        return false;
    }
}