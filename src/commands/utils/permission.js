const permission = require("../shared/permission");

module.exports = function(ws, res) {

    let args = res.properties.Message.split(" ");
    let [
        method,
        user,
        ...commands
    ] = args;

    console.log(method, user, commands);

    // if(method === 'grant')
        // permission.grant(user, )

}