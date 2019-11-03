const uuid = require("uuid/v4");
const chalk = require("chalk");
const prepareCommand = require("../commandGenerator");

module.exports = {

    armourStands: {},

    savePosition: function(ws, user) {
        let id = uuid();
        module.exports.armourStands[user] = id;
        ws.send(prepareCommand(`execute \"${user}\" ~~~ setblock ~~-1~ barrier 0 keep`));
        ws.send(prepareCommand(`execute \"${user}\" ~~~ summon minecraft:armor_stand`));
        ws.send(prepareCommand(`tag @e[type=minecraft:armor_stand,c=1] add ${id}`));
        ws.send(prepareCommand(`effect @e[type=minecraft:armor_stand,tag=${id}] invisibility 999999 255 true`));
        ws.send(prepareCommand(`effect @e[type=minecraft:armor_stand,tag=${id}] instant_health 999999 255 true`));
        console.log(chalk.cyan("!") + ` Process ${id} started`);
    },

    removeArmourStand: function(ws, user) {
        let id = module.exports.armourStands[user];
        ws.send(prepareCommand(`execute @e[type=minecraft:armor_stand,tag=${id},c=1] ~~~ fill ~~-1~ ~~-1~ air 0 replace barrier`));
        ws.send(prepareCommand(`kill @e[type=minecraft:armor_stand,tag=${id},c=1]`));
        ws.send(prepareCommand(`title \"${user}\" actionbar Command finished`));
        ws.send(prepareCommand(`execute \"${user}\" ~~~ playsound random.orb @s ~~~ 1 0.5`));
        delete module.exports.armourStands[user];
        console.log(chalk.cyan("!") + ` Process ${id} finished`);
    }
};