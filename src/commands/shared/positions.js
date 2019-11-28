const fs = require("fs");

const uuid = require("uuid/v4");
const chalk = require("chalk");
const prepareCommand = require("../commandGenerator");

module.exports = {

    armourStands: {},

    savePosition: function(ws, user) {
        let id = uuid();
        module.exports.armourStands[user] = id;

        fs.appendFileSync("./temp/uuids", `${id}\n`);
        ws.send(prepareCommand(`execute \"${user}\" ~~~ setblock ~~-1~ barrier 0 keep`));
        ws.send(prepareCommand(`execute \"${user}\" ~~~ summon minecraft:armor_stand`));
        ws.send(prepareCommand(`tag @e[type=minecraft:armor_stand,c=1] add "bt-${id}"`));
        ws.send(prepareCommand(`effect @e[type=minecraft:armor_stand,tag="bt-${id}"] invisibility 999999 255 true`));
        ws.send(prepareCommand(`effect @e[type=minecraft:armor_stand,tag="bt-${id}"] instant_health 999999 255 true`));
        console.log(chalk.cyan("!") + ` Process ${id} started`);
    },

    removeArmourStand: function(ws, user) {
        let id = module.exports.armourStands[user];

        ws.send(prepareCommand(`execute @e[type=minecraft:armor_stand,tag="bt-${id}",c=1] ~~~ fill ~~-1~ ~~-1~ air 0 replace barrier`));
        ws.send(prepareCommand(`tp @e[type=minecraft:armor_stand,tag="bt-${id}",c=1] ~ -100 ~`));
        ws.send(prepareCommand(`execute \"${user}\" ~~~ playsound mob.pig.boost @s ~~~`));
        delete module.exports.armourStands[user];
        console.log(chalk.cyan("!") + ` Process ${id} finished`);

        let uuids = fs.readFileSync("./temp/uuids", "UTF-8").split("\n");
        uuids = uuids.filter(function(x) {return x !== id});
        fs.writeFileSync("./temp/uuids", uuids);
    }
};