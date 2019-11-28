const uuid = require("uuid/v4");

module.exports = function(ws, eventName) {
    ws.send(JSON.stringify({
        "body": {
            "eventName": eventName
        },
        "header": {
            "requestId": uuid(),
            "messagePurpose": "subscribe",
            "version": 1,
            "messageType": "commandRequest"
        }
    }));
}