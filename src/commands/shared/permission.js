const fs = require("fs");

const chalk = require("chalk");
const commands = require("../../../data/commands.json");

let permissions = {}

if(!fs.existsSync("./config/permissions.json")) {
    Object.keys(commands).forEach(function(command) {
        permissions[command] = null
    });
    console.log(chalk.bgYellow.black(" WARNING ") + " No permission configuration file");
} else {
    fs.readFile("./config/permissions.json", "UTF-8", function(err, data) {
        if(err) console.log(err);

        let commandList = Object.keys(commands);
        data = JSON.parse(data);

        const dataKeys = Object.keys(data);
        for(let i = 0, x = dataKeys.length; i < x; i++) {
            for(let j = 0, y = commandList.length; j < y; j++) {
                const dType = typeof data[commandList[j]];
                if(dType === "object")
                    permissions[commandList[j]] = data[commandList[j]];
                
                else if(dType !== "undefined")
                    console.log(`${chalk.bgRed(" ERROR ")} The permission '${commandList[j]} has an invalid data type (${dType})'`);
                
                else
                    permissions[commandList[j]] = null;
            }
        }

        console.log("Permissions loaded");
    });
}

module.exports = {
    checkPermission: function(user, command) {
        if(permissions[command] === null) return true;
        
        for(let i = 0, n = permissions[command].length; i < n; i++) {
            if(permissions[command][i] === user) return true;
        }
        return false;
    }
}