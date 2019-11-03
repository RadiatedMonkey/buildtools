const uuid = require("uuid/v4");
module.exports = function(cmd) {
    return JSON.stringify({
        body: {
            origin: {
                type: "player"
            },
            commandLine: cmd,
            version: 1
        },
        header: {
            requestId: uuid(),
            messagePurpose: "commandRequest",
            version: 1,
            messageType: "commandRequest"
        }
    });
};